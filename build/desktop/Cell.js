import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// import React from 'react';
// import moment from "moment";
import luxon from "luxon";
import UserCell from './UserCell';
import FilesCell from './FilesCell';
const Cell = ({ type, value, property }) => {
    if (['CREATOR', 'MODIFIER'].includes(type)) {
        return _jsx(UserCell, { user: value }, void 0);
    }
    else if (['NUMBER', 'CALC'].includes(type)) {
        return _jsxs("div", Object.assign({ style: { textAlign: 'right' } }, { children: [property.unitPosition === 'BEFORE' ? `${property.unit} ` : '', value, property.unitPosition === 'AFTER' ? ` ${property.unit}` : ''] }), void 0);
    }
    else if (['MULTI_LINE_TEXT'].includes(type)) {
        return _jsx("div", Object.assign({ style: { whiteSpace: 'pre' } }, { children: value }), void 0);
    }
    else if (['RICH_TEXT'].includes(type)) {
        return _jsx("div", { dangerouslySetInnerHTML: { __html: value } }, void 0);
    }
    else if (['CHECK_BOX', 'MULTI_SELECT', 'CATEGORY'].includes(type)) {
        return _jsx("div", { children: value.map((v, i) => _jsx("div", { children: v }, i)) }, void 0);
    }
    else if (['DATETIME'].includes(type)) {
        // return <div>{moment(value).isValid() ? moment(value).format('YYYY-MM-DD HH:mm') : value}</div>;
        return _jsx("div", { children: luxon.DateTime.fromObject(value).isValid ? luxon.DateTime.fromObject(value).toFormat('YYYY-MM-DD HH:mm') : value }, void 0);
    }
    else if (['FILE'].includes(type)) {
        return _jsx(FilesCell, { files: value }, void 0);
    }
    else if (['LINK'].includes(type)) {
        return _jsx("div", { children: _jsx("a", Object.assign({ href: (property.protocol === 'CALL' ? 'callto:' : (property.protocol === 'MAIL' ? 'mailto:' : '')) + value, target: property.protocol === 'WEB' ? '_blank:' : '' }, { children: value }), void 0) }, void 0);
    }
    else if (['USER_SELECT', 'STATUS_ASSIGNEE'].includes(type)) {
        return _jsx("div", { children: value.map((user, i) => _jsx(UserCell, { user: user }, i)) }, void 0);
    }
    else if (['ORGANIZATION_SELECT', 'GROUP_SELECT'].includes(type)) {
        return _jsx("div", { children: value.map(({ name }, i) => _jsx("div", { children: name }, i)) }, void 0);
    }
    else {
        return _jsx("div", { children: value }, void 0);
    }
};
export default Cell;
