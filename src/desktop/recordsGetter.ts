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
  // static getFromAllReferenceTables(referenceTables: IReferenceTable[], selfRecord: kintoneRestApiClientTypes.Record): Promise<{ records: kintoneRestApiClientTypes.Record[], totalCount: number }[]> {
  //   return Promise.all(referenceTables.map(referenceTable => this.getFromSingleReferenceTable(referenceTable, selfRecord)));
  // }
  static getFromSingleReferenceTable(referenceTable: IReferenceTable, selfRecord: kintoneRestApiClientTypes.Record, offset: number = 0, limit: number = 100) {
    // console.log("at recordsGetter.getFromSingleReferenceTable, kintoneRestAPIClient=", kintoneRestAPIClient)
    return kintoneRestAPIClient.record.getRecords({ // getAllRecordsByCursor
      app: referenceTable.app,
      fields: ['$id', ...(referenceTable.shows || []).map(show => show.code)],
      query: queryCondition.create(referenceTable.conditions, selfRecord) +
        querySortManager.create(referenceTable.sorts) + " limit " + limit + " offset " + offset,
      // totalCount: true
      // withCursor: false
    }) // .then(responce => ({ records: responce, totalCount: responce?.length }));
  }
}