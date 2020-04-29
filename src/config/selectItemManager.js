export default class selectItemManager {
  static createItems (unFormattedItems, type = null) {
    let items = [{
      label: '-----',
      value: ''
    }];
    if(Array.isArray(unFormattedItems)) {
      items.push(...unFormattedItems.map(unFormattedItem => (
        type === 'fields' ? {
          label: unFormattedItem.label,
          value: unFormattedItem.code
        } : {
          label: unFormattedItem,
          value: unFormattedItem
        }
      )));
    }
    return items;
  }
  static getValue (unFormattedItems, value = '', type = null) {
    return (Array.isArray(unFormattedItems) && unFormattedItems.find(unFormattedItem => (
      type === 'fields' ? unFormattedItem.code === value : unFormattedItem === value
    ))) ? value : '';
  }
  static createItemsForFields (unFormattedItems) {
    return this.createItems(unFormattedItems, 'fields')
  }
  static getValueForFields (unFormattedItems, value = '') {
    return this.getValue(unFormattedItems, value, 'fields');
  }
}