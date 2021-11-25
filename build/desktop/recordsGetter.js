import queryCondition from "./queryConditonManager";
import querySortManager from "./querySortManager";
import { KintoneRestAPIClient } from '@kintone/rest-api-client';
const kintoneRestAPIClient = new KintoneRestAPIClient();
export default class recordsGetter {
    static getFromAllReferenceTables(referenceTables, selfRecord) {
        return Promise.all(referenceTables.map(referenceTable => this.getFromSingleReferenceTable(referenceTable, selfRecord)));
    }
    static getFromSingleReferenceTable(referenceTable, selfRecord) {
        return kintoneRestAPIClient.record.getAllRecords({
            app: referenceTable.app,
            condition: queryCondition.create(referenceTable.conditions, selfRecord),
            orderBy: querySortManager.create(referenceTable.sorts),
            fields: ['$id', ...referenceTable.shows.map(show => show.field)]
        }).then(responce => ({ records: responce, totalCount: responce === null || responce === void 0 ? void 0 : responce.length }));
    }
}
