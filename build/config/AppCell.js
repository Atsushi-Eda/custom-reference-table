// @ts-ignore
import React from 'react';
import { Text, Button } from '@kintone/kintone-ui-component';
const AppCell = props => {
    return (React.createElement("div", null,
        React.createElement(Text, { value: props.value || '', placeholder: 'app id', onChange: props.onChange }),
        React.createElement(Text, { value: props.appName || '', isDisabled: true, placeholder: 'app name' }),
        React.createElement(Button, { text: 'search', type: 'submit', onClick: props.onSearch(props.value) })));
};
export default AppCell;
