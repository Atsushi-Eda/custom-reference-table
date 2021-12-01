// @ts-ignore
import React from 'react';
import * as Kuc from '@kintone/kintone-ui-component'; // { Text, Button }
// import { Text, Button } from 'kintone-ui-component'; // { Text, Button }

import { AppID } from "@kintone/rest-api-client/lib/client/types";

interface IAppCellProps {
  value?: AppID,
  appName?: string,
  subTitle?: string,
  onChange: ((newValue: string | null) => void),
  onChangeSubTitle: ((newValue: string | null) => void),
  onSearch: ((anValue?: string) => void)
}

const AppCell = (props: IAppCellProps) => {
  return (
    <div>
      <Kuc.Text value={(props.value || '') + ''} placeholder='app id' onChange={props.onChange} />
      <Kuc.Text value={props.appName || ''} isDisabled={true} placeholder='app name' />
      <Kuc.Text value={(props.subTitle || '') + ''} placeholder='表示する見出し' onChange={props.onChangeSubTitle} />
      <Kuc.Button text='search' type='submit' onClick={(_) => props.onSearch((props.value || '') + '')} />
    </div>
  );
};
export default AppCell;