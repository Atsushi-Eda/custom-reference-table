import { ISortSpec } from "../../type/ReferenceTable";

export default class querySortManager {
  static create (sorts: ISortSpec[]) {
    if(!Array.isArray(sorts)) return '';
    return /*' order by ' +*/ sorts.filter(sort =>
      (sort.field && sort.operator)
    ).map(sort =>
      this.createUnit(sort)
    ).join(', ');
  }
  static createUnit (sort: ISortSpec) {
    return `${sort.field} ${sort.operator}`;
  }
}
