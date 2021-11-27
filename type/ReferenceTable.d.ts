import { AppID } from "@kintone/rest-api-client/lib/client/types";
import { OneOf } from "@kintone/rest-api-client/lib/KintoneFields/types/property";

type TOperatorString = '=' | '!=' | '>' | '<' | '>=' | '<=' | 'in' | 'not in' | 'like' | 'not like';

export interface IConditionSpec {
    targetField: string,
    operator: TOperatorString,
    selfField: string
}

export interface IConditionsCellProp {
    value: IConditionSpec[],
    targetFields: OneOf[] | null | undefined,
    selfFields: OneOf[],
    onChange: (newData: Array<Record<string, any>>) => void,
}

export interface ISortSpec {
    field: string,
    operator: string
}
export interface IReferenceTable {
    space: string,
    app: AppID,
    conditions: IConditionSpec[],
    shows: { field: string }[],
    sorts: ISortSpec[]
}
