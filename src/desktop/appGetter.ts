// import {Connection, App} from '@kintone/kintone-js-sdk';
// const kintoneApp = new App(new Connection);
// import { AppID } from "@kintone/rest-api-client/lib/client/types";

import { KintoneRestAPIClient } from '@kintone/rest-api-client';
import { IReferenceTable } from "../../type/ReferenceTable";
const kintoneRestAPIClient = new KintoneRestAPIClient();

export default class appGetter {
  static getFromAllReferenceTables(referenceTables: IReferenceTable[]) {
    return Promise.all(referenceTables.map(this.getFromSingleReferenceTable));
  }
  static getFromSingleReferenceTable(referenceTable: IReferenceTable) {
    return kintoneRestAPIClient.app.getApp({
      id: referenceTable.app
    });
  }
}
