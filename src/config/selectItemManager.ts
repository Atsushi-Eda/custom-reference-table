import type { OneOf } from "@kintone/rest-api-client/lib/KintoneFields/types/property";
export default class selectItemManager {
  static createItems(unFormattedItems: (string)[] | undefined) {
    // console.log("at selectItemManager createItems unFormattedItems=", unFormattedItems)
    const items = [{
      label: '-----',
      value: ''
    }];
    if (Array.isArray(unFormattedItems)) {
      Array.prototype.push.apply(items, unFormattedItems.map(unFormattedItem => ({
        label: unFormattedItem as string,
        value: unFormattedItem as string
      })));
    }
    return items;
  }
  static createItemsForFields(unFormattedItems: (OneOf)[] | undefined) {
    const items = [{
      label: '-----',
      value: ''
    }];
    if (Array.isArray(unFormattedItems)) {
      Array.prototype.push.apply(items, unFormattedItems.map(unFormattedItem => ({
        label: (unFormattedItem).label,
        value: (unFormattedItem).code
      })));
    }
    return items;
  }

  static getValue({ unFormattedItems, value = '' }: { unFormattedItems: string[] | undefined, value: string }) {
    return Array.isArray(unFormattedItems) ? (
      (unFormattedItems).find(unFormattedItem => (unFormattedItem) === value) || ''
    ) : '';
  }
  static getValueForFields(unFormattedItems: (OneOf)[] | undefined, value = '') {
    return Array.isArray(unFormattedItems) ? (
      (unFormattedItems).find(unFormattedItem => (unFormattedItem).code === value)?.code || ''
    ) : '';
  }
}