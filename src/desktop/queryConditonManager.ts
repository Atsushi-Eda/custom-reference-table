import type { IConditionSpec } from "../../type/ReferenceTable";
import type * as kintoneRestApiClientTypes from "@kintone/rest-api-client/lib/client/types";
import type { KintoneRecordField } from "@kintone/rest-api-client";

export default class queryCondition {
  static create(conditions: IConditionSpec[], record: kintoneRestApiClientTypes.Record) {
    if (!Array.isArray(conditions)) return '';
    return conditions.filter(condition =>
      (condition.targetField && condition.operator && condition.selfField)
    ).map(condition =>
      this.createUnit(condition, record)
    ).join(' and ');
  }
  static createUnit({ targetField, operator, selfField }: IConditionSpec, record: kintoneRestApiClientTypes.Record) {
    const selfFieldType = record[selfField].type;
    const selfFieldValue = record[selfField].value;
    if (['in', 'not in'].includes(operator)) {
      if (['CREATOR', 'MODIFIER'].includes(selfFieldType)) {
        return `${targetField} ${operator} ("${(record[selfField] as KintoneRecordField.Creator).value.code}")`;
      } else if (Array.isArray(selfFieldValue)) {
        if (selfFieldValue.length) {
          if (['FILE'].includes(selfFieldType)) {
            return `${targetField} ${operator} (${(record[selfField] as KintoneRecordField.File).value.map(({ name }) => JSON.stringify(name)).join(', ')})`;
          } else if (['USER_SELECT', 'STATUS_ASSIGNEE', 'ORGANIZATION_SELECT', 'GROUP_SELECT'].includes(selfFieldType)) {
            return `${targetField} ${operator} (${(record[selfField] as KintoneRecordField.UserSelect).value.map(({ code }) => JSON.stringify(code)).join(', ')})`;
          } else {
            return `${targetField} ${operator} (${selfFieldValue.map(v => JSON.stringify(v)).join(', ')})`;
          }
        } else {
          return `${targetField} ${operator} ("")`;
        }
      } else {
        return `${targetField} ${operator} (${JSON.stringify(selfFieldValue)})`;
      }
    } else {
      if (['CREATOR', 'MODIFIER'].includes(selfFieldType)) {
        return `${targetField} ${operator} ${JSON.stringify((record[selfField] as KintoneRecordField.Creator).value.code)}`;
      } else if (['FILE'].includes(selfFieldType)) {
        return `${targetField} ${operator} (${(record[selfField] as KintoneRecordField.File).value.map(({ name }) => JSON.stringify(name)).join(', ')})`;
      } else if (['USER_SELECT', 'STATUS_ASSIGNEE', 'ORGANIZATION_SELECT', 'GROUP_SELECT'].includes(selfFieldType)) {
        return `${targetField} ${operator} "${(record[selfField] as KintoneRecordField.UserSelect).value.map(({ code }) => code).join('')}"`;
      } else if (['CHECK_BOX', 'MULTI_SELECT', 'CATEGORY'].includes(selfFieldType)) {
        return `${targetField} ${operator} ${JSON.stringify((record[selfField] as KintoneRecordField.CheckBox).value.join(','))}`;
      } else {
        return `${targetField} ${operator} ${JSON.stringify(selfFieldValue)}`;
      }
    }
  }
}