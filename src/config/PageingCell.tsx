// @ts-ignore
import React from 'react';
import * as Kuc from '@kintone/kintone-ui-component'; // { Text }

const PageingLimitItems = [5,10,25,50,100].map(v => ({label: '' + v, value: '' + v}))
interface IPageingCellProps {
  value: string,
  onChange: ((newValue: string | null) => void),
}

const PageingCell = (props: IPageingCellProps) => {
  return (
    <div>
      <Kuc.Dropdown value={(props.value && props.value.length > 0 ? props.value : PageingLimitItems[0].value)}
       items={PageingLimitItems} onChange={props.onChange}
       />
    </div>
  );
};
export default PageingCell;