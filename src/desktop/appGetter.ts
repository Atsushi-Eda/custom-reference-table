// import {Connection, App} from '@kintone/kintone-js-sdk';
// const kintoneApp = new App(new Connection);
import { AppID } from "@kintone/rest-api-client/lib/client/types";

import { KintoneRestAPIClient } from '@kintone/rest-api-client';
const kintoneRestAPIClient = new KintoneRestAPIClient();

export default class appGetter {
  static getFromAllReferenceTables(referenceTables: { app: AppID }[]) {
    return Promise.all(referenceTables.map(this.getFromSingleReferenceTable));
  }
  static getFromSingleReferenceTable(referenceTable: { app: AppID }) {
    return kintoneRestAPIClient.app.getApp({
      id: referenceTable.app
    });
  }
}
