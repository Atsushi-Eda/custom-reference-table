import {Connection, App} from '@kintone/kintone-js-sdk';
const kintoneApp = new App(new Connection);

export default class appGetter {
  static getFromAllReferenceTables (referenceTables) {
    return Promise.all(referenceTables.map(this.getFromSingleReferenceTable));
  }
  static getFromSingleReferenceTable (referenceTable) {
    return kintoneApp.getApp({
      id: referenceTable.app
    });
  }
}