import { jsx as _jsx } from "react/jsx-runtime";
// import React from 'react';
import { render } from 'react-dom';
import Root from './Root';
// import {Connection, App} from '@kintone/kintone-js-sdk';
// const kintoneApp = new App(new Connection);
import { KintoneRestAPIClient } from '@kintone/rest-api-client';
// import { OneOf } from '@kintone/rest-api-client/lib/KintoneFields/types/field';
// import { Row } from '@kintone/rest-api-client/lib/KintoneFields/types/layout';
const kintoneRestAPIClient = new KintoneRestAPIClient();
(PLUGIN_ID => {
    const appId = kintone.app.getId();
    if (!appId) {
        console.error("ERROR at inedx.tsx: kintone.app.getId() === null.");
    }
    else {
        Promise.all([
            kintoneRestAPIClient.app.getFormFields({
                app: appId,
                preview: true
            }),
            kintoneRestAPIClient.app.getFormLayout({
                app: appId,
                preview: true
            }),
        ]).then(([{ properties }, { layout }]) => {
            var _a;
            render(_jsx(Root, { savedValue: JSON.parse(((_a = kintone.plugin.app.getConfig(PLUGIN_ID)) === null || _a === void 0 ? void 0 : _a.referenceTables) || '[]'), selfFields: Object.values(properties), 
                // @ts-ignore
                spaceIds: layout.map(row => row.fields).flat().filter(field => (field && field.type === 'SPACER')).map(field => field.elementId) }, void 0), document.getElementById('plugin-config-root'));
        });
    }
})(kintone.$PLUGIN_ID);
