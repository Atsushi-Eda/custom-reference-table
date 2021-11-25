// @ts-ignore
import React from 'react';
const UserCell = ({ user }) => {
    return React.createElement("div", null,
        React.createElement("a", { target: '_blank', href: `${location.origin}/k/#/people/user/${user.code}` }, user.name));
};
export default UserCell;
