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
import { AppID } from "@kintone/rest-api-client/lib/client/types";
import {OneOf} from "@kintone/rest-api-client/lib/KintoneFields/types/property";
// @ts-ignore
import { DispatchParams } from "@kintone/kintone-ui-component/esm/react/Table";

const kintoneRestAPIClient = new KintoneRestAPIClient();

interface IRootPropsType {
  savedValue: { app: AppID }[],
  selfFields: OneOf[],
  spaceIds: string[]
}
interface ITargetApp {
  id: string,
  name: string,
  fields: OneOf[] | null
}

export default class Root extends React.Component<IRootPropsType,
  { value: ({app: AppID, space: string } | any)[], targetApps: ITargetApp[] }>
{
  constructor(props: IRootPropsType) {
    super(props);
    const stateValue = props.savedValue.length ? props.savedValue : [{}];
    this.state = {
      value: stateValue,
      targetApps: stateValue.map(() => this.emptyTargetApp)
    }
    this.state.value.forEach(({ app }, rowIndex: number) => {
      if (app) this.searchApp(app, rowIndex);
    });
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
      }, rowIndex);
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
  }
  render() {
    const columns: TableColumn[] = [{
      header: 'space',
      cell: ({ rowIndex, onCellChange }) =>
        <Dropdown
          items={selectItemManager.createItems(this.props.spaceIds)}
          value={selectItemManager.getValue({ unFormattedItems: this.props.spaceIds, value: this.state.value[rowIndex as number].space })}
          onChange={newValue => onCellChange && onCellChange(newValue, this.state.value, rowIndex, 'space')}
        />
    }, {
      header: 'app',
      cell: ({ rowIndex, onCellChange }) =>
        <AppCell
          value={this.state.value[rowIndex as number].app}
          appName={this.state.targetApps[rowIndex as number].name}
          onSearch={appId => () => this.searchApp(appId, rowIndex)}
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
