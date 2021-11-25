export default class querySortManager {
  static create (sorts) {
    if(!Array.isArray(sorts)) return '';
    return /*' order by ' +*/ sorts.filter(sort =>
      (sort.field && sort.operator)
    ).map(sort =>
      this.createUnit(sort)
    ).join(', ');
  }
  static createUnit (sort) {
    return `${sort.field} ${sort.operator}`;
  }
}
