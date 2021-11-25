import { Record } from "@kintone/rest-api-client/lib/client/types";
export default class recordsGetter {
    static getFromAllReferenceTables(referenceTables: any, selfRecord: any): Promise<{
        records: Record[];
        totalCount: number;
    }[]>;
    static getFromSingleReferenceTable(referenceTable: any, selfRecord: any): Promise<{
        records: Record[];
        totalCount: number;
    }>;
}
