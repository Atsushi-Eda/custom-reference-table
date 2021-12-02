import queryCondition from "./queryConditonManager";
import querySortManager from "./querySortManager";
import type * as kintoneRestApiClientTypes from "@kintone/rest-api-client/lib/client/types";
// import type { Record } from "@kintone/rest-api-client/lib/client/types";
// import {Connection, Record} from '@kintone/kintone-js-sdk';
// const kintoneRecord = new Record(new Connection);
import { KintoneRestAPIClient } from '@kintone/rest-api-client';
import type { IReferenceTable } from "../../type/ReferenceTable";
const kintoneRestAPIClient = new KintoneRestAPIClient();

export default class recordsGetter {
  static getFromAllReferenceTables(referenceTables: IReferenceTable[], selfRecord: kintoneRestApiClientTypes.Record): Promise<{ records: kintoneRestApiClientTypes.Record[], totalCount: number }[]> {
    return Promise.all(referenceTables.map(referenceTable => this.getFromSingleReferenceTable(referenceTable, selfRecord)));
  }
  static getFromSingleReferenceTable(referenceTable: IReferenceTable, selfRecord: kintoneRestApiClientTypes.Record) {
    return kintoneRestAPIClient.record.getAllRecords({ // getAllRecordsByCursor
      app: referenceTable.app,
      condition: queryCondition.create(referenceTable.conditions, selfRecord),
      orderBy: querySortManager.create(referenceTable.sorts),
      fields: ['$id', ...referenceTable.shows.map(show => show.code)]
    }).then(responce => ({ records: responce, totalCount: responce?.length }));
  }
}