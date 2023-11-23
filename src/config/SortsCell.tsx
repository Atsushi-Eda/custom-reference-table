// @ts-ignore
import React from 'react';
import * as Kuc from '@kintone/kintone-ui-component'; // Table, Dropdown, 
import type { TableColumn } from '@kintone/kintone-ui-component';
import fieldsFilter from './fieldsFilter';
import selectItemManager from './selectItemManager';
// import { OneOf } from "@kintone/rest-api-client/lib/KintoneFields/types/property";
import type { ISortsCellProps } from '../../type/ReferenceTable';

const SortsCell = (props: ISortsCellProps) => {
  const operators = ['asc', 'desc'];
  const value = props.value || [{}];
  const columns: TableColumn[] = [{
    header: 'field',
    cell: ({ rowIndex, onCellChange }) =>
      <Kuc.Dropdown
        items={selectItemManager.createItemsForFields(fieldsFilter.sort(props.fields))}
        value={selectItemManager.getValueForFields(fieldsFilter.sort(props.fields), value[rowIndex || 0].field)}
        onChange={newValue => onCellChange && onCellChange(newValue, value, rowIndex, 'field')}
      />
  }, {
    header: 'operator',
    cell: ({ rowIndex, onCellChange }) =>
      <Kuc.Dropdown
        items={selectItemManager.createItems(operators)}
        value={selectItemManager.getValue({ unFormattedItems: operators, value: value[rowIndex || 0].operator }) as string}
        onChange={newValue => onCellChange && onCellChange(newValue, value, rowIndex, 'operator')}
      />
  }];
  return (
    <Kuc.Table
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
