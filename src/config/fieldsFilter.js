export default class fieldsFilter {
  static filter (fields, removals) {
    return (fields || []).filter(field => !removals.includes(field.type));
  }
  static conditionSelf (fields) {
    return this.filter(fields, [
      'SUBTABLE',
      'GROUP',
      'REFERENCE_TABLE'
    ]);
  }
  static conditionTarget (fields) {
    return this.filter(fields, [
      'STATUS_ASSIGNEE',
      'CATEGORY',
      'SUBTABLE',
      'GROUP',
      'REFERENCE_TABLE'
    ]);
  }
  static show (fields) {
    return this.filter(fields, [
      'SUBTABLE',
      'GROUP',
      'REFERENCE_TABLE',
    ]);
  }
  static sort (fields) {
    return this.filter(fields, [
      'STATUS_ASSIGNEE',
      'CATEGORY',
      'MULTI_LINE_TEXT',
      'RICH_TEXT',
      'DROP_DOWN',
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