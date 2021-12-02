import React from 'react';
import * as Kuc from '@kintone/kintone-ui-component'; // { Table, Dropdown, Button, TableColumn }
// @ts-ignore
import type { DispatchParams } from "kintone-ui-component/esm/react/Table";
import type { TableColumn } from '@kintone/kintone-ui-component';
import AppCell from './AppCell';
import ConditionsCell from './ConditionsCell';
import ShowsCell from './ShowsCell';
import SortsCell from './SortsCell';
import PageingCell from './PageingCell';
import selectItemManager from './selectItemManager';
// import {Connection, App} from '@kintone/kintone-js-sdk';
// const kintoneApp = new App(new Connection);
import { KintoneRestAPIClient } from '@kintone/rest-api-client';
// import { AppID } from "@kintone/rest-api-client/lib/client/types";
import type { OneOf } from "@kintone/rest-api-client/lib/KintoneFields/types/property";
import type * as KintoneFieldsProperty from "@kintone/rest-api-client/lib/KintoneFields/types/property";
import type { IReferenceTable } from '../../type/ReferenceTable';

const kintoneRestAPIClient = new KintoneRestAPIClient();

interface IRootPropsType {
  savedValue: IReferenceTable[],
  selfFields: OneOf[],
  spaceIds: string[]
}

interface ITargetApp {
  id: string,
  name: string,
  subTitle: string,
  fields: OneOf[] | null
}

interface IRootState {
  value: IReferenceTable[],
  targetApps: ITargetApp[]
}

export default class Root extends React.Component<IRootPropsType, IRootState>
{
  constructor(props: IRootPropsType) {
    super(props);
    // @ts-ignore
    const stateValue: IReferenceTable[] = props.savedValue?.length ? props.savedValue : [{}];
    this.state = {
      value: stateValue,
      targetApps: stateValue.map(() => this.emptyTargetApp)
    };
    (this.state.value as IReferenceTable[]).forEach(({ app }, rowIndex: number) => {
      if (app) this.searchApp(app, rowIndex);
    });
    // console.log("at config Root constructor this.state=", this.state)
  }
  emptyTargetApp: ITargetApp = {
    id: '',
    name: '',
    subTitle: '',
    fields: null
  }
  addTargetApp = (targetApp, rowIndex) => {
    const targetApps = [...this.state.targetApps];
    targetApps.splice(rowIndex, 0, targetApp);
    this.setState({ targetApps });
  }
  addEmptyTargetApp = rowIndex => {
    this.addTargetApp(this.emptyTargetApp, rowIndex);
  }
  removeTargetApp = rowIndex => {
    const targetApps = [...this.state.targetApps];
    targetApps.splice(rowIndex, 1);
    this.setState({ targetApps });
  }
  editTargetApp = (targetApp: ITargetApp, rowIndex) => {
    const targetApps = [...this.state.targetApps];
    targetApps[rowIndex] = targetApp;
    this.setState({ targetApps });
    console.log("at editTargetApp this.state.value=", this.state.value)
  }
  searchApp = (appId, rowIndex) => {
    Promise.all([
      kintoneRestAPIClient.app.getApp({ id: appId }),
      kintoneRestAPIClient.app.getFormFields({ app: appId })
    ]).then(([{ name }, { properties }]) => {
      this.editTargetApp({
        id: appId,
        name: name,
        subTitle: (!this.state.targetApps[rowIndex].subTitle || this.state.targetApps[rowIndex].subTitle.length <= 0) ? name :
          this.state.targetApps[rowIndex].subTitle,
        fields: Object.values(properties)
      } as ITargetApp, rowIndex);
    }).catch(e => {
      alert(e);
    });
  }
  editTargetApp_subTitle = (subTitle: string | null, rowIndex) => {
    const targetApps = [...this.state.targetApps];
    targetApps[rowIndex].subTitle = subTitle || '';
    this.setState({ targetApps });
    console.log("at editTargetApp_subTitle this.state.targetApps=", this.state.targetApps)
  }
  handleRowAdd = ({ data, rowIndex }: DispatchParams) => {
    this.addEmptyTargetApp(rowIndex);
    this.setState({ value: data });
  }
  handleRowRemove = ({ data, rowIndex }: DispatchParams) => {
    this.removeTargetApp(rowIndex);
    this.setState({ value: data });
  }
  handleCellChange = ({ data }) => {
    this.setState({ value: data });
  }
  save = (e) => {
    console.log("at save enterd this.state=", e, this.state)
    kintone.plugin.app.setConfig({
      referenceTables: JSON.stringify(this.state.value)
    }, () => { // successCallback 関数が指定された場合、アプリ設定のプラグインの一覧画面には遷移しません。
      console.log("at save kintone.plugin.app.setConfig successCallback enterd");
      // console.log("at save kintone.plugin.app.setConfig called. continues..");
      const updatePromise: Promise<any>[] = []; // 当該アプリの設定は更新していなくても、関連アプリのプロパティを更新している場合、saveで更新に追従する
      let notFounds: string[] = [];
      for (let rowIndex = 0; rowIndex < this.state.targetApps.length; rowIndex++) {
        const targetApp = this.state.targetApps[rowIndex];
        if ((targetApp.id === this.state.value[rowIndex].app) &&
          (this.state.value[rowIndex]?.shows?.length)
        ) {
          this.state.value[rowIndex].appName = targetApp.name;
          this.state.value[rowIndex].subTitle = targetApp.subTitle;
          updatePromise.push(
            kintoneRestAPIClient.app.getFormFields({ app: targetApp.id }) // this.state.value[rowIndex]?.shows?.length===0でも、targetApp.idの存在をチェックする
              .then(fieldProperties => {
                this.state.value[rowIndex].showFields = [];
                this.state.value[rowIndex].shows.forEach((showSpec, index1) => {
                  if (showSpec && (showSpec?.code?.length > 0)) {
                    const curProp = fieldProperties.properties[showSpec.code];
                    if (curProp) {
                      (this.state.value[rowIndex].showFields).push({
                        type: curProp.type,
                        code: curProp.code,
                        label: curProp.label,
                        // 表示には不要な、ネストしているsubTable等のプロパティを除外して、メモリ節約する。 ∵kintone.plugin.app.setConfigの容量制限による。
                        defaultValue: (curProp as KintoneFieldsProperty.SingleLineText).defaultValue,
                        minLength: (curProp as KintoneFieldsProperty.SingleLineText).minLength,
                        maxLength: (curProp as KintoneFieldsProperty.SingleLineText).maxLength,
                        format: (curProp as KintoneFieldsProperty.Calc).format,
                        unit: (curProp as KintoneFieldsProperty.Number).unit,
                        unitPosition: (curProp as KintoneFieldsProperty.Number).unitPosition,
                        minValue: (curProp as KintoneFieldsProperty.Number).minValue,
                        maxValue: (curProp as KintoneFieldsProperty.Number).maxValue,
                        digit: (curProp as KintoneFieldsProperty.Number).digit,
                        displayScale: (curProp as KintoneFieldsProperty.Number).displayScale,
                        protocol: (curProp as KintoneFieldsProperty.Link).protocol,
                        options: (curProp as KintoneFieldsProperty.CheckBox).options
                      } as never);
                    } else {
                      notFounds.push(`関連テーブル${targetApp.name}にフィールドコード${showSpec.code}が在りません。`);
                    }
                  } else {
                    notFounds.push(`関連テーブル${targetApp.name}の${index1}番目に指定されたフィールドコードが空です。`);
                  }
                })
                if (this.state.value[rowIndex]?.shows?.length !== this.state.value[rowIndex]?.showFields?.length) {
                  notFounds.push(`関連テーブルとして有効なフィールドの数が足りません。`);
                }
              })
          );
        }
      }
      console.log("at save updatePromise builded", updatePromise)
      kintone.Promise.all(updatePromise).then(_ => {
        console.log("at save this.state=", this.state)
        if (notFounds.length > 0) {
          throw new Error(notFounds.join("\n"));
        }
      }).then(_ => {
        kintone.plugin.app.setConfig({ //  kintone.plugin.app.setConfig で設定できる key-value の value 値の合計は 256KB までです。
          referenceTables: JSON.stringify(this.state.value)
        }); // callbackが未指定または undefined か null が指定された場合、プラグイン設定情報の保存が完了したらアプリ設定のプラグインの一覧画面に遷移して設定完了メッセージを表示します。
      }).catch(err => {
        console.error(err) // targetApp.idが存在しなかった場合、または、this.state.value[rowIndex].shows[].codeが無かった場合
      });
    });
    console.log("at save leaved")
  }
  render() {
    const columns: TableColumn[] = [{
      header: 'space',
      cell: ({ rowIndex, onCellChange }) =>
        <Kuc.Dropdown
          items={selectItemManager.createItems(this.props.spaceIds)}
          value={selectItemManager.getValue({ unFormattedItems: this.props.spaceIds, value: this.state.value[rowIndex || 0].space }) as string}
          onChange={newValue => onCellChange && onCellChange(newValue, this.state.value, rowIndex, 'space')}
        />
    }, {
      header: 'app',
      cell: ({ rowIndex, onCellChange }) =>
        <AppCell
          value={this.state.value[rowIndex as number].app}
          appName={this.state.targetApps[rowIndex as number].name}
          subTitle={this.state.targetApps[rowIndex as number].subTitle}
          onSearch={appId => this.searchApp(appId, rowIndex)}
          onChange={newValue => onCellChange && onCellChange(newValue, this.state.value, rowIndex, 'app')}
          onChangeSubTitle={newValue => this.editTargetApp_subTitle(newValue, rowIndex)}
        />
    }, {
      header: 'conditions',
      cell: ({ rowIndex, onCellChange }) =>
        <ConditionsCell
          value={this.state.value[rowIndex as number].conditions}
          targetFields={this.state.targetApps[rowIndex as number].fields}
          selfFields={this.props.selfFields}
          onChange={newValue => onCellChange && onCellChange(newValue, this.state.value, rowIndex, 'conditions')}
        />
    }, {
      header: 'shows',
      cell: ({ rowIndex, onCellChange }) =>
        <ShowsCell
          value={this.state.value[rowIndex as number].shows}
          fields={this.state.targetApps[rowIndex as number].fields}
          onChange={newValue => onCellChange && onCellChange(newValue, this.state.value, rowIndex, 'shows')}
        />
    }, {
      header: 'sorts',
      cell: ({ rowIndex, onCellChange }) =>
        <SortsCell
          value={this.state.value[rowIndex as number].sorts}
          fields={this.state.targetApps[rowIndex as number].fields}
          onChange={newValue => onCellChange && onCellChange(newValue, this.state.value, rowIndex, 'sorts')}
        />
    }, {
      header: 'scroll',
      cell: ({ rowIndex, onCellChange }) =>
        <PageingCell
          value={this.state.value[rowIndex as number].limit}
          onChange={newValue => onCellChange && onCellChange(newValue, this.state.value, rowIndex, 'limit')}
        />
    }
    ];
    return (
      <div>
        <Kuc.Table
          columns={columns}
          data={this.state.value}
          defaultRowData={{}}
          onRowAdd={this.handleRowAdd}
          onRowRemove={this.handleRowRemove}
          onCellChange={this.handleCellChange}
        />
        <Kuc.Button text='save' type='submit' onClick={this.save} />
      </div>
    );
  }
}
