// @ts-ignore
import React from 'react';
// import moment from "moment";
import luxon from "luxon";
import UserCell from './UserCell';
import FilesCell from './FilesCell';
const Cell = ({ type, value, property }) => {
    if (['CREATOR', 'MODIFIER'].includes(type)) {
        return React.createElement(UserCell, { user: value });
    }
    else if (['NUMBER', 'CALC'].includes(type)) {
        return React.createElement("div", { style: { textAlign: 'right' } },
            property.unitPosition === 'BEFORE' ? `${property.unit} ` : '',
            value,
            property.unitPosition === 'AFTER' ? ` ${property.unit}` : '');
    }
    else if (['MULTI_LINE_TEXT'].includes(type)) {
        return React.createElement("div", { style: { whiteSpace: 'pre' } }, value);
    }
    else if (['RICH_TEXT'].includes(type)) {
        return React.createElement("div", { dangerouslySetInnerHTML: { __html: value } });
    }
    else if (['CHECK_BOX', 'MULTI_SELECT', 'CATEGORY'].includes(type)) {
        return React.createElement("div", null, value.map((v, i) => React.createElement("div", { key: i }, v)));
    }
    else if (['DATETIME'].includes(type)) {
        // return <div>{moment(value).isValid() ? moment(value).format('YYYY-MM-DD HH:mm') : value}</div>;
        return React.createElement("div", null, luxon.DateTime.fromObject(value).isValid ? luxon.DateTime.fromObject(value).toFormat('YYYY-MM-DD HH:mm') : value);
    }
    else if (['FILE'].includes(type)) {
        return React.createElement(FilesCell, { files: value });
    }
    else if (['LINK'].includes(type)) {
        return React.createElement("div", null,
            React.createElement("a", { href: (property.protocol === 'CALL' ? 'callto:' : (property.protocol === 'MAIL' ? 'mailto:' : '')) + value, target: property.protocol === 'WEB' ? '_blank:' : '' }, value));
    }
    else if (['USER_SELECT', 'STATUS_ASSIGNEE'].includes(type)) {
        return React.createElement("div", null, value.map((user, i) => React.createElement(UserCell, { key: i, user: user })));
    }
    else if (['ORGANIZATION_SELECT', 'GROUP_SELECT'].includes(type)) {
        return React.createElement("div", null, value.map(({ name }, i) => React.createElement("div", { key: i }, name)));
    }
    else {
        return React.createElement("div", null, value);
    }
};
export default Cell;
