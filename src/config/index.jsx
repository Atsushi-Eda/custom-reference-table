import React from 'react';
import {render} from 'react-dom';
import Root from './Root';
// import {Connection, App} from '@kintone/kintone-js-sdk';
// const kintoneApp = new App(new Connection);
import { KintoneRestAPIClient } from '@kintone/rest-api-client';
const kintoneRestAPIClient = new KintoneRestAPIClient();

(PLUGIN_ID => {
  Promise.all([
    kintoneRestAPIClient.app.getFormFields({
      app: kintone.app.getId(),
      isPreview: true
    }),
    kintoneRestAPIClient.app.getFormLayout({
      app: kintone.app.getId(),
      isPreview: true
    }),
  ]).then(([{properties}, {layout}]) => {
    render(
      <Root
        savedValue={JSON.parse(kintone.plugin.app.getConfig(PLUGIN_ID)?.referenceTables || '[]')}
        selfFields={Object.values(properties)}
        spaceIds={layout.map(row => row.fields).flat().filter(field => (field && field.type === 'SPACER')).map(field => field.elementId)}
      />,
      document.getElementById('plugin-config-root')
    );
  });
})(kintone.$PLUGIN_ID);