import React from 'react';
import UserCell from './UserCell';
import FilesCell from './FilesCell';

const Cell = ({type, value, property}) => {
  if(['CREATOR', 'MODIFIER'].includes(type)){
    return <UserCell user={value} />;
  }else if(['NUMBER'].includes(type)){
    if(property.unitPosition === 'BEFORE'){
      return <div>{property.unit} {value}</div>;
    }else{
      return <div>{value} {property.unit}</div>;
    }
  }else if(['RICH_TEXT'].includes(type)){
    return <div dangerouslySetInnerHTML={{__html: value}}></div>;
  }else if(['CHECK_BOX', 'MULTI_SELECT', 'CATEGORY'].includes(type)){
    return <div>{value.map((v, i) => <div key={i}>{v}</div>)}</div>;
  }else if(['FILE'].includes(type)){
    return <FilesCell files={value} />;
  }else if(['USER_SELECT', 'STATUS_ASSIGNEE'].includes(type)){
    return <div>{value.map((user, i) => <UserCell key={i} user={user} />)}</div>;
  }else if(['ORGANIZATION_SELECT', 'GROUP_SELECT'].includes(type)){
    return <div>{value.map(({name}, i) => <div key={i}>{name}</div>)}</div>;
  }else{
    return <div>{value}</div>;
  }
}
export default Cell;
