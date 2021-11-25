// import React from 'react';
import { Table, Dropdown } from '@kintone/kintone-ui-component';
import fieldsFilter from './fieldsFilter';
import selectItemManager from './selectItemManager';
// @ts-ignore
import { DispatchParams } from "@kintone/kintone-ui-component/esm/react/Table";

const SortsCell = props => {
  const operators = ['asc', 'desc'];
  const value = props.value || [{}];
  const columns = [{
    header: 'field',
    cell: ({ rowIndex, onCellChange }: DispatchParams) =>
      <Dropdown
        items={selectItemManager.createItemsForFields(fieldsFilter.sort(props.fields))}
        value={selectItemManager.getValueForFields(fieldsFilter.sort(props.fields), value[rowIndex].field)}
        onChange={newValue => onCellChange(newValue, value, rowIndex, 'field')}
      />
  }, {
    header: 'operator',
    cell: ({ rowIndex, onCellChange }: DispatchParams) =>
      <Dropdown
        items={selectItemManager.createItems(operators)}
        value={selectItemManager.getValue({ unFormattedItems: operators, value: value[rowIndex].operator })}
        onChange={newValue => onCellChange(newValue, value, rowIndex, 'operator')}
      />
  }];
  return (
    <Table
      columns={columns}
      data={value}
      defaultRowData={{}}
      onRowAdd={({ data }) => props.onChange(data)}
      onRowRemove={({ data }) => props.onChange(data)}
      onCellChange={({ data }) => props.onChange(data)}
    />
  );
};
export default SortsCell;
