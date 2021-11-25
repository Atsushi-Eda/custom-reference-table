// @ts-ignore
import React from 'react';
import ReactDOM from 'react-dom';
import { Label, Table } from '@kintone/kintone-ui-component';
import IdCell from './IdCell';
import Cell from './Cell';
import recordsGetter from "./recordsGetter";
import appGetter from "./appGetter";
import formFieldsGetter from "./formFieldsGetter";
// import { AppID, RecordID, Revision, Properties, Lang, Layout } from "@kintone/rest-api-client/lib/client/types";
(PLUGIN_ID => {
    var _a;
    const referenceTables = JSON.parse(((_a = kintone.plugin.app.getConfig(PLUGIN_ID)) === null || _a === void 0 ? void 0 : _a.referenceTables) || '[]');
    // @ts-ignore
    window.customReferenceTablePlugin = {
        getRecordsFromSingleReferenceTable: (index, selfRecord) => recordsGetter.getFromSingleReferenceTable(referenceTables[index], selfRecord),
        getRecordsFromAllReferenceTables: selfRecord => recordsGetter.getFromAllReferenceTables(referenceTables, selfRecord)
    };
    kintone.events.on([
        'app.record.detail.show',
        'app.record.print.show',
    ], event => {
        Promise.all([
            recordsGetter.getFromAllReferenceTables(referenceTables, event.record),
            appGetter.getFromAllReferenceTables(referenceTables),
            formFieldsGetter.getFromAllReferenceTables(referenceTables)
        ]).then(([recordsResponses, appResponses, formFieldsResponses]) => {
            referenceTables.forEach((referenceTable, index) => {
                const records = recordsResponses[index].records;
                const app = appResponses[index];
                const properties = formFieldsResponses[index].properties;
                const space = kintone.app.record.getSpaceElement(referenceTable.space);
                if (!space)
                    return;
                const domRoot = document.createElement('div');
                domRoot.id = 'custom-reference-table-plugin-' + index;
                domRoot.classList.add(event.type === 'app.record.detail.show' ? 'custom-reference-table-plugin-detail' : 'custom-reference-table-plugin-print');
                space.appendChild(domRoot);
                ReactDOM.render(React.createElement("div", null,
                    React.createElement(Label, { text: app.name }),
                    React.createElement(Table, { columns: [
                            ...(event.type === 'app.record.detail.show' ? [{
                                    header: 'id',
                                    cell: ({ rowIndex }) => React.createElement(IdCell, { app: referenceTable.app, "$id": records[rowIndex].$id.value })
                                }] : []),
                            ...referenceTable.shows.map(({ field }) => ({
                                header: properties[field].label,
                                cell: ({ rowIndex }) => React.createElement(Cell, { type: records[rowIndex][field].type, value: records[rowIndex][field].value, property: properties[field] })
                            }))
                        ], data: records, actionButtonsShown: false })), domRoot);
            });
        });
    });
})(kintone.$PLUGIN_ID);
