import { KintoneRestAPIClient } from '@kintone/rest-api-client';
const kintoneRestAPIClient = new KintoneRestAPIClient();
export default class appGetter {
    getFromAllReferenceTables(referenceTables) {
        return Promise.all(referenceTables.map(this.getFromSingleReferenceTable));
    }
    getFromSingleReferenceTable(referenceTable) {
        return kintoneRestAPIClient.app.getApp({
            id: referenceTable.app
        });
    }
}
