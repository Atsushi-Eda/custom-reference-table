// @ts-ignore
import React from 'react';
import {Table, Dropdown} from '@kintone/kintone-ui-component';
import fieldsFilter from './fieldsFilter';
import selectItemManager from './selectItemManager';
// @ts-ignore
import { DispatchParams } from "@kintone/kintone-ui-component/esm/react/Table";


const ShowsCell = props => {
  const value = props.value || [{}];
  const columns = [{
    header: 'field',
    cell: ({rowIndex, onCellChange}: DispatchParams) =>
      <Dropdown
        items={selectItemManager.createItemsForFields(fieldsFilter.show(props.fields))}
        value={selectItemManager.getValueForFields(fieldsFilter.show(props.fields), value[rowIndex].field)}
        onChange={newValue => onCellChange(newValue, value, rowIndex, 'field')}
      />
  }];
  return (
    <Table
      columns={columns}
      data={value}
      defaultRowData={{}}
      onRowAdd={({data}) => props.onChange(data)}
      onRowRemove={({data}) => props.onChange(data)}
      onCellChange={({data}) => props.onChange(data)}
    />
  );
};
export default ShowsCell;
