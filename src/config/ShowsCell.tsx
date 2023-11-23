// @ts-ignore
import React from 'react';
import * as Kuc from '@kintone/kintone-ui-component'; // Table, Dropdown,
import type { TableColumn } from '@kintone/kintone-ui-component';

import fieldsFilter from './fieldsFilter';
import selectItemManager from './selectItemManager';
import type { OneOf } from "@kintone/rest-api-client/lib/KintoneFields/types/property";
import type { IShowsSpec } from '../../type/ReferenceTable';

interface IShowsCellProps {
  value: Array<IShowsSpec>,
  fields: OneOf[] | null,
  onChange: (_data?: Array<Record<string, any>>) => void
}
const ShowsCell = (props: IShowsCellProps) => {
  const value = props.value || [{}];
  const columns: TableColumn[] = [{
    header: 'fieldCode',
    cell: ({ rowIndex, onCellChange }) =>
      <Kuc.Dropdown
        items={selectItemManager.createItemsForFields(fieldsFilter.show(props.fields))}
        value={selectItemManager.getValueForFields(fieldsFilter.show(props.fields), value[rowIndex || 0].code)}
        onChange={newValue => onCellChange && onCellChange(newValue, value, rowIndex, 'code')}
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
export default ShowsCell;
