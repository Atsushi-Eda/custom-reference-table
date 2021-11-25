export default class queryCondition {
    static create(conditions: any, record: any): string;
    static createUnit({ targetField, operator, selfField }: {
        targetField: any;
        operator: any;
        selfField: any;
    }, record: any): string;
}
