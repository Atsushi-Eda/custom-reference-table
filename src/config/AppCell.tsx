// @ts-ignore
import React from 'react';
import {Text, Button} from '@kintone/kintone-ui-component';

const AppCell = props => {
  return (
    <div>
      <Text value={props.value || ''} placeholder='app id' onChange={props.onChange} />
      <Text value={props.appName || ''} isDisabled={true} placeholder='app name' />
      <Button text='search' type='submit' onClick={props.onSearch(props.value)} />
    </div>
  );
};
export default AppCell;