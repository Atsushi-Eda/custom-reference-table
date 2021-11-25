import { AppID } from "@kintone/rest-api-client/lib/client/types";
export default class appGetter {
    static getFromAllReferenceTables(referenceTables: {
        app: AppID;
    }[]): Promise<import("@kintone/rest-api-client/lib/client/types").App[]>;
    static getFromSingleReferenceTable(referenceTable: {
        app: AppID;
    }): Promise<import("@kintone/rest-api-client/lib/client/types").App>;
}
