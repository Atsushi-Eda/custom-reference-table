import { AppID, Properties } from "@kintone/rest-api-client/lib/client/types";
// import { OneOf } from "@kintone/rest-api-client/lib/KintoneFields/types/field";
import { OneOf } from "@kintone/rest-api-client/lib/KintoneFields/types/property";
import * as KintoneFieldsProperty from "@kintone/rest-api-client/lib/KintoneFields/types/property";

type TOperatorString = '=' | '!=' | '>' | '<' | '>=' | '<=' | 'in' | 'not in' | 'like' | 'not like';

export interface IConditionSpec {
    targetField: string,
    operator: TOperatorString,
    selfField: string
}

export interface IConditionsCellProp {
    value: Array<IConditionSpec>,
    targetFields: OneOf[] | null | undefined,
    selfFields: OneOf[],
    onChange: (newData: Array<Record<string, any>>) => void,
}

export interface IShowsSpec {
    code: string
}

export interface ISortSpec {
    field: string,
    operator: string
}

export interface ISortsCellProps {
    value: Array<ISortSpec>,
    fields: OneOf[] | null,
    onChange: (_data?: Array<Record<string, any>>) => void
}

export interface IReferenceTable {
    space: string,
    app: AppID,
    appName: string,
    subTitle: string,
    conditions: IConditionSpec[],
    limit: number,
    shows: IShowsSpec[],  // config中の表示向けカラム
    showFields: Array<OneOf>,
        // & KintoneFieldsProperty.SingleLineText &
        // KintoneFieldsProperty.MultiLineText &
        // KintoneFieldsProperty.Number & KintoneFieldsProperty.Calc &
        // KintoneFieldsProperty.CheckBox & KintoneFieldsProperty.RadioButton & KintoneFieldsProperty.Dropdown &
        // KintoneFieldsProperty.Date & KintoneFieldsProperty.Time & KintoneFieldsProperty.DateTime &
        // KintoneFieldsProperty.Link & KintoneFieldsProperty.CheckBox>, // config.save以降で参照するshows毎のfieldsプロパティ
    sorts: ISortSpec[]
}
