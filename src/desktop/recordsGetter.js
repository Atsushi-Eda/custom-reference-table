import queryCondition from "./queryConditonManager";
import querySortManager from "./querySortManager";
import {Connection, Record} from '@kintone/kintone-js-sdk';
const kintoneRecord = new Record(new Connection);

export default class recordsGetter {
  static getFromAllReferenceTables (referenceTables, selfRecord) {
    return Promise.all(referenceTables.map(referenceTable => this.getFromSingleReferenceTable(referenceTable, selfRecord)));
  }
  static getFromSingleReferenceTable (referenceTable, selfRecord) {
    return kintoneRecord.getAllRecordsByCursor({
      app: referenceTable.app,
      query: queryCondition.create(referenceTable.conditions, selfRecord) + querySortManager.create(referenceTable.sorts),
      fields: ['$id', ...referenceTable.shows.map(show => show.field)]
    });
  }
}