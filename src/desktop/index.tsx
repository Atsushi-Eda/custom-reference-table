// @ts-ignore
import React from 'react';
import ReactDOM from 'react-dom';
import { Label, Table, TableColumn } from '@kintone/kintone-ui-component';
import IdCell from './IdCell';
import Cell from './Cell';
import recordsGetter from "./recordsGetter";
// import appGetter from "./appGetter";
// import formFieldsGetter from "./formFieldsGetter";
// import { AppID, RecordID, Revision, Properties, Lang, Layout } from "@kintone/rest-api-client/lib/client/types";
// import { AppID } from "@kintone/rest-api-client/lib/client/types";
import * as KintoneFieldsField from "@kintone/rest-api-client/lib/KintoneFields/types/field";
import { IReferenceTable } from '../../type/ReferenceTable';
import { OneOf } from '@kintone/rest-api-client/lib/KintoneFields/types/property';

(PLUGIN_ID => {
  const referenceTables: IReferenceTable[] = JSON.parse(kintone.plugin.app.getConfig(PLUGIN_ID)?.referenceTables || '[]')
    .filter(referenceTable => (referenceTable &&
      referenceTable.app &&
      referenceTable.space &&
      Array.isArray(referenceTable.conditions) &&
      // !Array.isArray(referenceTable.sorts) || // sort指定は無くても良い
      Array.isArray(referenceTable.shows) // 設定画面で編集途中の関連テーブル定義を除外する
    ));
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
      // appGetter.getFromAllReferenceTables(referenceTables),
      // formFieldsGetter.getFromAllReferenceTables(referenceTables)
    ]).then(([recordsResponses /*, appResponses, formFieldsResponses*/]) => {
      referenceTables.forEach((referenceTable, index) => {
        const records = recordsResponses[index].records;
        // const app = appResponses[index];
        // const properties = formFieldsResponses[index].properties;
        // const properties: { [fieldCode: string]: OneOf } = referenceTable.showFields?.reduce((h, v) => { h[v.code] = v; return h; }, {}) || {};
        const space = kintone.app.record.getSpaceElement(referenceTable.space);
        if (!space) return;
        console.log("at event", event, { index, referenceTable })
        const domRoot = document.createElement('div');
        domRoot.id = 'custom-reference-table-plugin-' + index;
        domRoot.classList.add(event.type === 'app.record.detail.show' ? 'custom-reference-table-plugin-detail' : 'custom-reference-table-plugin-print');
        space.appendChild(domRoot);
        ReactDOM.render(
          <div>
            <Label text={referenceTable.appName} />
            <Table
              columns={[
                ...(event.type === 'app.record.detail.show' ? [{
                  header: 'id',
                  cell: ({ rowIndex }: { rowIndex: number }) => <IdCell app={referenceTable.app} $id={(records[rowIndex].$id as KintoneFieldsField.ID).value} />
                }] : []),
                ...(referenceTable.showFields || []).map(fieldProp => ({ // ...referenceTable.shows.map(({ code }) => ({
                  header: fieldProp.label, // properties[code].label,
                  cell: ({ rowIndex }: { rowIndex: number }) =>
                    <Cell
                      type={records[rowIndex][fieldProp.code].type}
                      value={records[rowIndex][fieldProp.code].value}
                      property={fieldProp} // properties[code]
                    />
                }))
              ] as TableColumn[]}
              data={records}
              actionButtonsShown={false}
            />
          </div>,
          domRoot
        );
      });
      console.log("at event " + event.type + " referenceTables=", referenceTables)
    });
  });
})(kintone.$PLUGIN_ID);
