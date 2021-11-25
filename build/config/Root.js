import React from 'react';
import { Table, Dropdown, Button } from '@kintone/kintone-ui-component';
import AppCell from './AppCell';
import ConditionsCell from './ConditionsCell';
import ShowsCell from './ShowsCell';
import SortsCell from './SortsCell';
import selectItemManager from './selectItemManager';
// import {Connection, App} from '@kintone/kintone-js-sdk';
// const kintoneApp = new App(new Connection);
import { KintoneRestAPIClient } from '@kintone/rest-api-client';
const kintoneRestAPIClient = new KintoneRestAPIClient();
export default class Root extends React.Component {
    constructor(props) {
        super(props);
        this.emptyTargetApp = {
            id: '',
            name: '',
            fields: null
        };
        this.addTargetApp = (targetApp, rowIndex) => {
            const targetApps = [...this.state.targetApps];
            targetApps.splice(rowIndex, 0, targetApp);
            this.setState({ targetApps });
        };
        this.addEmptyTargetApp = rowIndex => {
            this.addTargetApp(this.emptyTargetApp, rowIndex);
        };
        this.removeTargetApp = rowIndex => {
            const targetApps = [...this.state.targetApps];
            targetApps.splice(rowIndex, 1);
            this.setState({ targetApps });
        };
        this.editTargetApp = (targetApp, rowIndex) => {
            const targetApps = [...this.state.targetApps];
            targetApps[rowIndex] = targetApp;
            this.setState({ targetApps });
        };
        this.searchApp = (appId, rowIndex) => {
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
        };
        this.handleRowAdd = ({ data, rowIndex }) => {
            this.addEmptyTargetApp(rowIndex);
            this.setState({ value: data });
        };
        this.handleRowRemove = ({ data, rowIndex }) => {
            this.removeTargetApp(rowIndex);
            this.setState({ value: data });
        };
        this.handleCellChange = ({ data }) => {
            this.setState({ value: data });
        };
        this.save = () => {
            kintone.plugin.app.setConfig({
                referenceTables: JSON.stringify(this.state.value)
            });
        };
        const stateValue = props.savedValue.length ? props.savedValue : [{}];
        this.state = {
            value: stateValue,
            targetApps: stateValue.map(() => this.emptyTargetApp)
        };
        this.state.value.forEach(({ app }, rowIndex) => {
            if (app)
                this.searchApp(app, rowIndex);
        });
    }
    render() {
        const columns = [{
                header: 'space',
                cell: ({ rowIndex, onCellChange }) => React.createElement(Dropdown, { items: selectItemManager.createItems(this.props.spaceIds), value: selectItemManager.getValue({ unFormattedItems: this.props.spaceIds, value: this.state.value[rowIndex].space }), onChange: newValue => onCellChange && onCellChange(newValue, this.state.value, rowIndex, 'space') })
            }, {
                header: 'app',
                cell: ({ rowIndex, onCellChange }) => React.createElement(AppCell, { value: this.state.value[rowIndex].app, appName: this.state.targetApps[rowIndex].name, onSearch: appId => () => this.searchApp(appId, rowIndex), onChange: newValue => onCellChange && onCellChange(newValue, this.state.value, rowIndex, 'app') })
            }, {
                header: 'conditions',
                cell: ({ rowIndex, onCellChange }) => React.createElement(ConditionsCell, { value: this.state.value[rowIndex].conditions, targetFields: this.state.targetApps[rowIndex].fields, selfFields: this.props.selfFields, onChange: newValue => onCellChange && onCellChange(newValue, this.state.value, rowIndex, 'conditions') })
            }, {
                header: 'shows',
                cell: ({ rowIndex, onCellChange }) => React.createElement(ShowsCell, { value: this.state.value[rowIndex].shows, fields: this.state.targetApps[rowIndex].fields, onChange: newValue => onCellChange && onCellChange(newValue, this.state.value, rowIndex, 'shows') })
            }, {
                header: 'sorts',
                cell: ({ rowIndex, onCellChange }) => React.createElement(SortsCell, { value: this.state.value[rowIndex].sorts, fields: this.state.targetApps[rowIndex].fields, onChange: newValue => onCellChange && onCellChange(newValue, this.state.value, rowIndex, 'sorts') })
            }];
        return (React.createElement("div", null,
            React.createElement(Table, { columns: columns, data: this.state.value, defaultRowData: {}, onRowAdd: this.handleRowAdd, onRowRemove: this.handleRowRemove, onCellChange: this.handleCellChange }),
            React.createElement(Button, { text: 'save', type: 'submit', onClick: this.save })));
    }
}
