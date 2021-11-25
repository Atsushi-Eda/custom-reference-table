// @ts-ignore
import React from 'react';
import { Table, Dropdown } from '@kintone/kintone-ui-component';
import fieldsFilter from './fieldsFilter';
import selectItemManager from './selectItemManager';
import conditionOperatorsManager from './conditionOperatorsManager';
const ConditionsCell = (props) => {
    const value = props.value || [{}];
    const columns = [{
            header: 'target field',
            cell: ({ rowIndex, onCellChange }) => React.createElement(Dropdown, { items: selectItemManager.createItemsForFields(fieldsFilter.conditionTarget(props.targetFields)), value: selectItemManager.getValueForFields(fieldsFilter.conditionTarget(props.targetFields), value[rowIndex].targetField), onChange: newValue => onCellChange(newValue, value, rowIndex, 'targetField') })
        }, {
            header: 'operator',
            cell: ({ rowIndex, onCellChange }) => React.createElement(Dropdown, { items: selectItemManager.createItems(conditionOperatorsManager.get(props.targetFields, value, rowIndex)), value: selectItemManager.getValue({ unFormattedItems: conditionOperatorsManager.get(props.targetFields, value, rowIndex), value: value[rowIndex].operator }), onChange: newValue => onCellChange(newValue, value, rowIndex, 'operator') })
        }, {
            header: 'self field',
            cell: ({ rowIndex, onCellChange }) => React.createElement(Dropdown, { items: selectItemManager.createItemsForFields(fieldsFilter.conditionSelf(props.selfFields)), value: selectItemManager.getValueForFields(fieldsFilter.conditionSelf(props.selfFields), value[rowIndex].selfField), onChange: newValue => onCellChange(newValue, value, rowIndex, 'selfField') })
        }];
    return (React.createElement(Table, { columns: columns, data: value, defaultRowData: {}, onRowAdd: ({ data }) => props.onChange(data), onRowRemove: ({ data }) => props.onChange(data), onCellChange: ({ data }) => props.onChange(data) }));
};
export default ConditionsCell;
