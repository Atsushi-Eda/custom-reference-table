// import {Connection, App} from '@kintone/kintone-js-sdk';
// const kintoneApp = new App(new Connection);
import { AppID, Revision, Properties } from "@kintone/rest-api-client/lib/client/types";
import { KintoneRestAPIClient } from '@kintone/rest-api-client';

const kintoneRestAPIClient = new KintoneRestAPIClient();

export default class formFieldsGetter {
  static getFromAllReferenceTables(referenceTables): Promise<{ properties: Properties, revision: Revision }[]> {
    return Promise.all(referenceTables.map(this.getFromSingleReferenceTable));
  }
  static getFromSingleReferenceTable(referenceTable: { app: AppID }) {
    return kintoneRestAPIClient.app.getFormFields({
      app: referenceTable.app
    });
  }
}