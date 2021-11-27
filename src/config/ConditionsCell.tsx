// @ts-ignore
import React from 'react';
import { Table, Dropdown, TableColumn } from '@kintone/kintone-ui-component';
import fieldsFilter from './fieldsFilter';
import selectItemManager from './selectItemManager';
import conditionOperatorsManager from './conditionOperatorsManager';
import { IConditionsCellProp, IConditionSpec } from '../../type/ReferenceTable';

const ConditionsCell = (props: IConditionsCellProp) => {
  const value: Array<IConditionSpec> = props.value || [{}];
  const columns: TableColumn[] = [{
    header: 'target field',
    cell: ({ rowIndex, onCellChange }) =>
      <Dropdown
        items={selectItemManager.createItemsForFields(fieldsFilter.conditionTarget(props.targetFields))}
        value={selectItemManager.getValueForFields(fieldsFilter.conditionTarget(props.targetFields), value[rowIndex || 0].targetField)}
        onChange={newValue => onCellChange && onCellChange(newValue, value, rowIndex, 'targetField')}
      />
  }, {
    header: 'operator',
    cell: ({ rowIndex, onCellChange }) => {
      // console.log("conditionOperatorsManager.get(props.targetFields, value, rowIndex) =", props, rowIndex, conditionOperatorsManager.get(props.targetFields, value, rowIndex || 0))
      return <Dropdown
        items={selectItemManager.createItems(conditionOperatorsManager.get(props.targetFields, value, rowIndex || 0) as string[])}
        value={selectItemManager.getValue({ unFormattedItems: conditionOperatorsManager.get(props.targetFields, value, rowIndex || 0) as string[], value: value[rowIndex || 0].operator })}
        onChange={newValue => onCellChange && onCellChange(newValue, value, rowIndex, 'operator')}
      />
    }
  }, {
    header: 'self field',
    cell: ({ rowIndex, onCellChange }) =>
      <Dropdown
        items={selectItemManager.createItemsForFields(fieldsFilter.conditionSelf(props.selfFields))}
        value={selectItemManager.getValueForFields(fieldsFilter.conditionSelf(props.selfFields), value[rowIndex || 0].selfField)}
        onChange={newValue => onCellChange && onCellChange(newValue, value, rowIndex, 'selfField')}
      />
  }];
  return (
    <Table
      columns={columns}
      data={value}
      defaultRowData={{}}
      onRowAdd={({ data }) => props.onChange(data as typeof value)}
      onRowRemove={({ data }) => props.onChange(data as typeof value)}
      onCellChange={({ data }) => props.onChange(data as typeof value)}
    />
  );
};
export default ConditionsCell;
