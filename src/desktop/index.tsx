// @ts-ignore
import React from 'react';
import type { IReferenceTable } from '../../type/ReferenceTable';
import { renderCustomReferrenceTable } from './kinToneDataTable';
// import recordsGetter from './recordsGetter';

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
  // window.customReferenceTablePlugin = {
  //   getRecordsFromSingleReferenceTable: (index, selfRecord) => recordsGetter.getFromSingleReferenceTable(referenceTables[index], selfRecord),
  //   // getRecordsFromAllReferenceTables: selfRecord => recordsGetter.getFromAllReferenceTables(referenceTables, selfRecord)
  // };
  kintone.events.on([
    'app.record.detail.show',
    'app.record.print.show',
  ], event => {
    return renderCustomReferrenceTable(event, referenceTables);
  });
})(kintone.$PLUGIN_ID);
