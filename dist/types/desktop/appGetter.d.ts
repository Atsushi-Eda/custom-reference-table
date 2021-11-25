import { AppID } from "@kintone/rest-api-client/lib/client/types";
export default class appGetter {
    getFromAllReferenceTables(referenceTables: any[]): Promise<import("@kintone/rest-api-client/lib/client/types").App[]>;
    getFromSingleReferenceTable(referenceTable: {
        app: AppID;
    }): Promise<import("@kintone/rest-api-client/lib/client/types").App>;
}
