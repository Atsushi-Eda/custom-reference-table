import React from 'react';
import { Table, Dropdown, Button, TableColumn } from '@kintone/kintone-ui-component';
import AppCell from './AppCell';
import ConditionsCell from './ConditionsCell';
import ShowsCell from './ShowsCell';
import SortsCell from './SortsCell';
import selectItemManager from './selectItemManager';
// import {Connection, App} from '@kintone/kintone-js-sdk';
// const kintoneApp = new App(new Connection);
import { KintoneRestAPIClient } from '@kintone/rest-api-client';
// import { AppID } from "@kintone/rest-api-client/lib/client/types";
import { OneOf } from "@kintone/rest-api-client/lib/KintoneFields/types/property";
// @ts-ignore
import { DispatchParams } from "@kintone/kintone-ui-component/esm/react/Table";
import { IReferenceTable } from '../../type/ReferenceTable';

const kintoneRestAPIClient = new KintoneRestAPIClient();

interface IRootPropsType {
  savedValue: IReferenceTable[],
  selfFields: OneOf[],
  spaceIds: string[]
}

interface ITargetApp {
  id: string,
  name: string,
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
  editTargetApp = (targetApp, rowIndex) => {
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
        fields: Object.values(properties)
      } as ITargetApp, rowIndex);
    }).catch(e => {
      alert(e);
    });
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
  save = () => {
    kintone.plugin.app.setConfig({
      referenceTables: JSON.stringify(this.state.value)
    });
    console.log("at save this.state.value=", this.state.value)
  }
  render() {
    const columns: TableColumn[] = [{
      header: 'space',
      cell: ({ rowIndex, onCellChange }) =>
        <Dropdown
          items={selectItemManager.createItems(this.props.spaceIds)}
          value={selectItemManager.getValue({ unFormattedItems: this.props.spaceIds, value: this.state.value[rowIndex || 0].space })}
          onChange={newValue => onCellChange && onCellChange(newValue, this.state.value, rowIndex, 'space')}
        />
    }, {
      header: 'app',
      cell: ({ rowIndex, onCellChange }) =>
        <AppCell
          value={this.state.value[rowIndex as number].app}
          appName={this.state.targetApps[rowIndex as number].name}
          onSearch={appId => this.searchApp(appId, rowIndex)}
          onChange={newValue => onCellChange && onCellChange(newValue, this.state.value, rowIndex, 'app')}
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
    }];
    return (
      <div>
        <Table
          columns={columns}
          data={this.state.value}
          defaultRowData={{}}
          onRowAdd={this.handleRowAdd}
          onRowRemove={this.handleRowRemove}
          onCellChange={this.handleCellChange}
        />
        <Button text='save' type='submit' onClick={this.save} />
      </div>
    );
  }
}
