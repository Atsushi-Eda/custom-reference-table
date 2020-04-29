export default class queryCondition {
  static create (conditions, record) {
    if(!Array.isArray(conditions)) return '';
    return conditions.filter(condition =>
      (condition.targetField && condition.operator && condition.selfField)
    ).map(condition =>
      this.createUnit(condition, record)
    ).join(' and ');
  }
  static createUnit ({targetField, operator, selfField}, record) {
    const selfFieldType = record[selfField].type;
    const selfFieldValue = record[selfField].value;
    if(['in', 'not in'].includes(operator)){
      if(['CREATOR', 'MODIFIER'].includes(selfFieldType)){
        return `${targetField} ${operator} ("${selfFieldValue.code}")`;
      }else if(['CHECK_BOX', 'MULTI_SELECT', 'CATEGORY'].includes(selfFieldType)){
        return `${targetField} ${operator} (${selfFieldValue.map(v => `"${v}"`).join(', ')})`;
      }else if(['FILE'].includes(selfFieldType)){
        return `${targetField} ${operator} (${selfFieldValue.map(({name}) => `"${name}"`).join(', ')})`;
      }else if(['USER_SELECT', 'STATUS_ASSIGNEE', 'ORGANIZATION_SELECT', 'GROUP_SELECT'].includes(selfFieldType)){
        return `${targetField} ${operator} (${selfFieldValue.map(({code}) => `"${code}"`).join(', ')})`;
      }else{
        return `${targetField} ${operator} ("${selfFieldValue}")`;
      }
    }else{
      if(['CREATOR', 'MODIFIER'].includes(selfFieldType)){
        return `${targetField} ${operator} "${selfFieldValue.code}"`;
      }else if(['CHECK_BOX', 'MULTI_SELECT', 'CATEGORY'].includes(selfFieldType)){
        return `${targetField} ${operator} "${selfFieldValue.join('')}"`;
      }else if(['FILE'].includes(selfFieldType)){
        return `${targetField} ${operator} "${selfFieldValue.map(({name}) => name).join('')}"`;
      }else if(['USER_SELECT', 'STATUS_ASSIGNEE', 'ORGANIZATION_SELECT', 'GROUP_SELECT'].includes(selfFieldType)){
        return `${targetField} ${operator} "${selfFieldValue.map(({code}) => code).join('')}"`;
      }else{
        return `${targetField} ${operator} "${selfFieldValue}"`;
      }
    }
  }
}