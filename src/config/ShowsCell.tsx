// @ts-ignore
import React from 'react';
import { Table, Dropdown, TableColumn } from '@kintone/kintone-ui-component';

import fieldsFilter from './fieldsFilter';
import selectItemManager from './selectItemManager';
import { OneOf } from "@kintone/rest-api-client/lib/KintoneFields/types/property";

interface IShowsCellProps {
  value: Array<Record<string, any>>,
  fields: OneOf[] | null,
  onChange: (_data?: Array<Record<string, any>>) => void
}
const ShowsCell = (props: IShowsCellProps) => {
  const value = props.value || [{}];
  const columns: TableColumn[] = [{
    header: 'field',
    cell: ({ rowIndex, onCellChange }) =>
      <Dropdown
        items={selectItemManager.createItemsForFields(fieldsFilter.show(props.fields))}
        value={selectItemManager.getValueForFields(fieldsFilter.show(props.fields), value[rowIndex || 0].field)}
        onChange={newValue => onCellChange && onCellChange(newValue, value, rowIndex, 'field')}
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
export default ShowsCell;
