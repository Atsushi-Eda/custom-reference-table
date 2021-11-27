// @ts-ignore
import React from 'react';
import { Text, Button } from '@kintone/kintone-ui-component';
import { AppID } from "@kintone/rest-api-client/lib/client/types";

interface IAppCellProps {
  value?: AppID,
  appName?: string,
  onChange: ((newValue: string | null) => void),
  onSearch: ((anValue?: string) => void)
}

const AppCell = (props: IAppCellProps) => {
  return (
    <div>
      <Text value={(props.value || '') + ''} placeholder='app id' onChange={props.onChange} />
      <Text value={props.appName || ''} isDisabled={true} placeholder='app name' />
      <Button text='search' type='submit' onClick={(_) => props.onSearch((props.value || '') + '')} />
    </div>
  );
};
export default AppCell;