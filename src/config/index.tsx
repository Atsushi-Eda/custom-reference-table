// @ts-ignore
import React from 'react';
import { render } from 'react-dom';
import Root from './Root';
// import {Connection, App} from '@kintone/kintone-js-sdk';
// const kintoneApp = new App(new Connection);
import { KintoneRestAPIClient } from '@kintone/rest-api-client';
import { Field } from "@kintone/rest-api-client/lib/KintoneFields/types/layout";

// import { OneOf } from '@kintone/rest-api-client/lib/KintoneFields/types/field';
import { Row } from '@kintone/rest-api-client/lib/KintoneFields/types/layout';
const kintoneRestAPIClient = new KintoneRestAPIClient();

(PLUGIN_ID => {
  const appId = kintone.app.getId();
  if (!appId) {
    console.error("ERROR at inedx.tsx: kintone.app.getId() === null.")
  } else {
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
      render(
        <Root
          savedValue={JSON.parse(kintone.plugin.app.getConfig(PLUGIN_ID)?.referenceTables || '[{}]')}
          selfFields={Object.values(properties)}
          spaceIds={layout.map(row => (row as Row<Field.OneOf[]>).fields).flat()
            .filter(field => (field && field.type === 'SPACER'))
            .map(field => (field as Field.Spacer).elementId)}
        />,
        document.getElementById('plugin-config-root')
      );
    });
  }
})(kintone.$PLUGIN_ID);