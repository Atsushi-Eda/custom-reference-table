import React from 'react';

const UserCell = ({user}) => {
  return <div><a target='_blank' href={`${location.origin}/k/#/people/user/${user.code}`}>{user.name}</a></div>
}
export default UserCell;