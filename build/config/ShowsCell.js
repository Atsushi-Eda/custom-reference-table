import { jsx as _jsx } from "react/jsx-runtime";
// import React from 'react';
import { Table, Dropdown } from '@kintone/kintone-ui-component';
import fieldsFilter from './fieldsFilter';
import selectItemManager from './selectItemManager';
const ShowsCell = props => {
    const value = props.value || [{}];
    const columns = [{
            header: 'field',
            cell: ({ rowIndex, onCellChange }) => _jsx(Dropdown, { items: selectItemManager.createItemsForFields(fieldsFilter.show(props.fields)), value: selectItemManager.getValueForFields(fieldsFilter.show(props.fields), value[rowIndex].field), onChange: newValue => onCellChange(newValue, value, rowIndex, 'field') }, void 0)
        }];
    return (_jsx(Table, { columns: columns, data: value, defaultRowData: {}, onRowAdd: ({ data }) => props.onChange(data), onRowRemove: ({ data }) => props.onChange(data), onCellChange: ({ data }) => props.onChange(data) }, void 0));
};
export default ShowsCell;
