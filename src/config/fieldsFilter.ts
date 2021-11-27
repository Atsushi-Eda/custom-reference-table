import { OneOf } from "@kintone/rest-api-client/lib/KintoneFields/types/property";
export default class fieldsFilter {
  static filter(fields: OneOf[] | null | undefined, removals: string[]) {
    return (fields || []).filter(field => !removals.includes(field.type));
  }
  static conditionSelf(fields: OneOf[] | null | undefined) {
    return this.filter(fields, [
      'SUBTABLE',
      'GROUP',
      'REFERENCE_TABLE'
    ]);
  }
  static conditionTarget(fields: OneOf[] | null | undefined) {
    return this.filter(fields, [
      'CATEGORY',
      'SUBTABLE',
      'GROUP',
      'REFERENCE_TABLE'
    ]);
  }
  static show(fields: OneOf[] | null | undefined) {
    return this.filter(fields, [
      'SUBTABLE',
      'GROUP',
      'REFERENCE_TABLE',
    ]);
  }
  static sort(fields: OneOf[] | null | undefined) {
    return this.filter(fields, [
      'STATUS_ASSIGNEE',
      'CATEGORY',
      'MULTI_LINE_TEXT',
      'RICH_TEXT',
      'CHECK_BOX',
      'MULTI_SELECT',
      'FILE',
      'USER_SELECT',
      'ORGANIZATION_SELECT',
      'GROUP_SELECT',
      'SUBTABLE',
      'GROUP',
      'REFERENCE_TABLE'
    ]);
  }
}