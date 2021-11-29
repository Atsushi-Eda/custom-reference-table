import { OneOf } from "@kintone/rest-api-client/lib/KintoneFields/types/property";
import { IConditionSpec, TOperatorString } from '../../type/ReferenceTable';

export default class conditionOperatorsManager {
  static mapper = new Map<string,TOperatorString[]>([
    ['RECORD_NUMBER', ['=', '!=', '>', '<', '>=', '<=', 'in', 'not in']],
    ['CREATOR', ['in', 'not in']],
    ['CREATED_TIME', ['=', '!=', '>', '<', '>=', '<=']],
    ['MODIFIER', ['in', 'not in']],
    ['UPDATED_TIME', ['=', '!=', '>', '<', '>=', '<=']],
    ['SINGLE_LINE_TEXT', ['=', '!=', 'in', 'not in', 'like', 'not like']],
    ['LINK', ['=', '!=', 'in', 'not in', 'like', 'not like']],
    ['NUMBER', ['=', '!=', '>', '<', '>=', '<=', 'in', 'not in']],
    ['CALC', ['=', '!=', '>', '<', '>=', '<=', 'in', 'not in']],
    ['MULTI_LINE_TEXT', ['like', 'not like']],
    ['RICH_TEXT', ['like', 'not like']],
    ['CHECK_BOX', ['in', 'not in']],
    ['RADIO_BUTTON', ['in', 'not in']],
    ['DROP_DOWN', ['in', 'not in']],
    ['MULTI_SELECT', ['in', 'not in']],
    ['FILE', ['like', 'not like']],
    ['DATE', ['=', '!=', '>', '<', '>=', '<=']],
    ['TIME', ['=', '!=', '>', '<', '>=', '<=']],
    ['DATETIME', ['=', '!=', '>', '<', '>=', '<=']],
    ['USER_SELECT', ['in', 'not in']],
    ['ORGANIZATION_SELECT', ['in', 'not in']],
    ['GROUP_SELECT', ['in', 'not in']],
    ['STATUS', ['=', '!=', 'in', 'not in']],
    ['STATUS_ASSIGNEE', ['in', 'not in']],
    ['CATEGORY', ['in', 'not in']]
  ])
  static get(targetFields: OneOf[] | null | undefined, value: IConditionSpec[], rowIndex: number) {
    if (!value[rowIndex] || !value[rowIndex].targetField || !targetFields) return null;
    else return this.mapper.get((targetFields.find(targetField => targetField.code === value[rowIndex].targetField) as OneOf)?.type) as TOperatorString[];
  }
}