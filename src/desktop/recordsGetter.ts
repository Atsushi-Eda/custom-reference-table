import queryCondition from "./queryConditonManager";
import querySortManager from "./querySortManager";
// import {Connection, Record} from '@kintone/kintone-js-sdk';
// const kintoneRecord = new Record(new Connection);
import { Record } from "@kintone/rest-api-client/lib/client/types";
import { KintoneRestAPIClient } from '@kintone/rest-api-client';
import { IReferenceTable } from "../../type/ReferenceTable";
const kintoneRestAPIClient = new KintoneRestAPIClient();

export default class recordsGetter {
  static getFromAllReferenceTables(referenceTables: IReferenceTable[], selfRecord: Record): Promise<{ records: Record[], totalCount: number }[]> {
    return Promise.all(referenceTables.filter(referenceTable => (!referenceTable ||
      !referenceTable.app ||
      !referenceTable.space ||
      !Array.isArray(referenceTable.conditions) ||
      // !Array.isArray(referenceTable.sorts) || // sort指定は無くても良い
      !Array.isArray(referenceTable.shows) // 設定画面で編集途中の関連テーブル定義を除外する
    ))
      .map(referenceTable => this.getFromSingleReferenceTable(referenceTable, selfRecord)));
  }
  static getFromSingleReferenceTable(referenceTable: IReferenceTable, selfRecord: Record) {
    return kintoneRestAPIClient.record.getAllRecords({ // getAllRecordsByCursor
      app: referenceTable.app,
      condition: queryCondition.create(referenceTable.conditions, selfRecord),
      orderBy: querySortManager.create(referenceTable.sorts),
      fields: ['$id', ...referenceTable.shows.map(show => show.field)]
    }).then(responce => ({ records: responce, totalCount: responce?.length }));
  }
}