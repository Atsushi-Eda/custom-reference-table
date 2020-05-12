import React from 'react';
import moment from "moment";
import UserCell from './UserCell';
import FilesCell from './FilesCell';

const Cell = ({type, value, property}) => {
  if(['CREATOR', 'MODIFIER'].includes(type)){
    return <UserCell user={value} />;
  }else if(['NUMBER', 'CALC'].includes(type)){
    return <div style={{textAlign: 'right'}}>
      {property.unitPosition === 'BEFORE' ? `${property.unit} ` : ''}
      {value}
      {property.unitPosition === 'AFTER' ? ` ${property.unit}` : ''}
    </div>;
  }else if(['MULTI_LINE_TEXT'].includes(type)){
    return <div style={{whiteSpace: 'pre'}}>{value}</div>;
  }else if(['RICH_TEXT'].includes(type)){
    return <div dangerouslySetInnerHTML={{__html: value}}></div>;
  }else if(['CHECK_BOX', 'MULTI_SELECT', 'CATEGORY'].includes(type)){
    return <div>{value.map((v, i) => <div key={i}>{v}</div>)}</div>;
  }else if(['DATETIME'].includes(type)){
    return <div>{moment(value).isValid() ? moment(value).format('YYYY-MM-DD HH:mm') : value}</div>;
  }else if(['FILE'].includes(type)){
    return <FilesCell files={value} />;
  }else if(['LINK'].includes(type)){
    return <div>
      <a
        href={(property.protocol === 'CALL' ? 'callto:' : (property.protocol === 'MAIL' ? 'mailto:' : '')) + value}
        target={property.protocol === 'WEB' ? '_blank:' :  ''}
      >
        {value}
      </a>
    </div>;
  }else if(['USER_SELECT', 'STATUS_ASSIGNEE'].includes(type)){
    return <div>{value.map((user, i) => <UserCell key={i} user={user} />)}</div>;
  }else if(['ORGANIZATION_SELECT', 'GROUP_SELECT'].includes(type)){
    return <div>{value.map(({name}, i) => <div key={i}>{name}</div>)}</div>;
  }else{
    return <div>{value}</div>;
  }
}
export default Cell;
