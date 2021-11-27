import { OneOf } from "@kintone/rest-api-client/lib/KintoneFields/types/property";
export default class selectItemManager {
  static createItems(unFormattedItems: (OneOf | string)[] | undefined, type: string | null = null) {
    // console.log("at selectItemManager createItems unFormattedItems=", unFormattedItems)
    let items = [{
      label: '-----',
      value: ''
    }];
    if (Array.isArray(unFormattedItems)) {
      items.push(...unFormattedItems.map(unFormattedItem => (
        type === 'fields' ? {
          label: (unFormattedItem as OneOf).label,
          value: (unFormattedItem as OneOf).code
        } : {
          label: unFormattedItem as string,
          value: unFormattedItem as string
        }
      )));
    }
    return items;
  }
  static getValue({ unFormattedItems, value = '', type = null }: { unFormattedItems: (OneOf | string)[]; value?: string; type?: string | null; }) {
    return (Array.isArray(unFormattedItems) && unFormattedItems.find(unFormattedItem => (
      type === 'fields' ? (unFormattedItem as OneOf).code === value : (unFormattedItem as string) === value
    ))) ? value : '';
  }
  static createItemsForFields(unFormattedItems: (OneOf | string)[]) {
    return this.createItems(unFormattedItems, 'fields')
  }
  static getValueForFields(unFormattedItems: (OneOf | string)[], value = '') {
    return this.getValue({ unFormattedItems, value, type: 'fields' });
  }
}