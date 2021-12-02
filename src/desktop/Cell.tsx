// @ts-ignore
import React from 'react';
// import moment from "moment";
import * as luxon from "luxon";
import UserCell from './UserCell';
import FilesCell from './FilesCell';
import type { OneOf } from "@kintone/rest-api-client/lib/KintoneFields/types/property";
import type * as KintoneFieldsProperty from "@kintone/rest-api-client/lib/KintoneFields/types/property";

const Cell = ({ type, value, property }: { type: string, value: any, property: OneOf }) => {
  if (['CREATOR', 'MODIFIER'].includes(type)) {
    return <UserCell user={value} />;
  } else if (['NUMBER', 'CALC'].includes(type)) {
    return <div style={{ textAlign: 'right' }}>
      {(property as KintoneFieldsProperty.Number).unitPosition === 'BEFORE' ? `${(property as KintoneFieldsProperty.Number).unit} ` : ''}
      {((type === 'CALC' && ((property as KintoneFieldsProperty.Calc).format === 'NUMBER_DIGIT')) ||
        (property as KintoneFieldsProperty.Number).digit) ? Number(value).toLocaleString() :
        value}
      {(property as KintoneFieldsProperty.Number).unitPosition === 'AFTER' ? ` ${(property as KintoneFieldsProperty.Number).unit}` : ''}
    </div>;
  } else if (['MULTI_LINE_TEXT'].includes(type)) {
    return <div style={{ whiteSpace: 'pre' }}>{value}</div>;
  } else if (['RICH_TEXT'].includes(type)) {
    return <div dangerouslySetInnerHTML={{ __html: value }}></div>;
  } else if (['CHECK_BOX', 'MULTI_SELECT', 'CATEGORY'].includes(type)) {
    return <div>{(value).map((v, i) => <div key={i}>{v}</div>)}</div>;
  } else if (['DATETIME', 'UPDATED_TIME', 'CREATED_TIME'].includes(type)) {
    // console.log("at Cell type=DATETIMEm, value=", value)
    // return <div>{moment(value).isValid() ? moment(value).format('YYYY-MM-DD HH:mm') : value}</div>;
    return <div>{luxon.DateTime.fromISO(value, { zone: 'utc' }).isValid ? luxon.DateTime.fromISO(value, { zone: 'utc' }).toFormat('yyyy-MM-dd HH:mm') : value}</div>;
  } else if (['FILE'].includes(type)) {
    return <FilesCell files={value} />;
  } else if (['LINK'].includes(type)) {
    return <div>
      <a
        href={((property as KintoneFieldsProperty.Link).protocol === 'CALL' ? 'callto:' : ((property as KintoneFieldsProperty.Link).protocol === 'MAIL' ? 'mailto:' : '')) + value}
        target={(property as KintoneFieldsProperty.Link).protocol === 'WEB' ? '_blank:' : ''}
      >
        {value}
      </a>
    </div>;
  } else if (['USER_SELECT', 'STATUS_ASSIGNEE'].includes(type)) {
    return <div>{value.map((user, i) => <UserCell key={i} user={user} />)}</div>;
  } else if (['ORGANIZATION_SELECT', 'GROUP_SELECT'].includes(type)) {
    return <div>{value.map(({ name }, i) => <div key={i}>{name}</div>)}</div>;
  } else {
    return <div>{value}</div>;
  }
}
export default Cell;
