import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// import React from 'react';
import { Text, Button } from '@kintone/kintone-ui-component';
const AppCell = props => {
    return (_jsxs("div", { children: [_jsx(Text, { value: props.value || '', placeholder: 'app id', onChange: props.onChange }, void 0), _jsx(Text, { value: props.appName || '', isDisabled: true, placeholder: 'app name' }, void 0), _jsx(Button, { text: 'search', type: 'submit', onClick: props.onSearch(props.value) }, void 0)] }, void 0));
};
export default AppCell;
