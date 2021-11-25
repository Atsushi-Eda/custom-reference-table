import { jsx as _jsx } from "react/jsx-runtime";
// import React from 'react';
import { Table, Dropdown } from '@kintone/kintone-ui-component';
import fieldsFilter from './fieldsFilter';
import selectItemManager from './selectItemManager';
import conditionOperatorsManager from './conditionOperatorsManager';
const ConditionsCell = props => {
    const value = props.value || [{}];
    const columns = [{
            header: 'target field',
            cell: ({ rowIndex, onCellChange }) => _jsx(Dropdown, { items: selectItemManager.createItemsForFields(fieldsFilter.conditionTarget(props.targetFields)), value: selectItemManager.getValueForFields(fieldsFilter.conditionTarget(props.targetFields), value[rowIndex].targetField), onChange: newValue => onCellChange(newValue, value, rowIndex, 'targetField') }, void 0)
        }, {
            header: 'operator',
            cell: ({ rowIndex, onCellChange }) => _jsx(Dropdown, { items: selectItemManager.createItems(conditionOperatorsManager.get(props.targetFields, value, rowIndex)), value: selectItemManager.getValue({ unFormattedItems: conditionOperatorsManager.get(props.targetFields, value, rowIndex), value: value[rowIndex].operator }), onChange: newValue => onCellChange(newValue, value, rowIndex, 'operator') }, void 0)
        }, {
            header: 'self field',
            cell: ({ rowIndex, onCellChange }) => _jsx(Dropdown, { items: selectItemManager.createItemsForFields(fieldsFilter.conditionSelf(props.selfFields)), value: selectItemManager.getValueForFields(fieldsFilter.conditionSelf(props.selfFields), value[rowIndex].selfField), onChange: newValue => onCellChange(newValue, value, rowIndex, 'selfField') }, void 0)
        }];
    return (_jsx(Table, { columns: columns, data: value, defaultRowData: {}, onRowAdd: ({ data }) => props.onChange(data), onRowRemove: ({ data }) => props.onChange(data), onCellChange: ({ data }) => props.onChange(data) }, void 0));
};
export default ConditionsCell;
