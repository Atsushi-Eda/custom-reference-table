import { AppID, Revision, Properties } from "@kintone/rest-api-client/lib/client/types";
export default class formFieldsGetter {
    static getFromAllReferenceTables(referenceTables: any): Promise<{
        properties: Properties;
        revision: Revision;
    }[]>;
    static getFromSingleReferenceTable(referenceTable: {
        app: AppID;
    }): Promise<{
        properties: Properties;
        revision: string;
    }>;
}
