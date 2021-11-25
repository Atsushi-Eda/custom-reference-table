import { jsx as _jsx } from "react/jsx-runtime";
// import React from 'react';
const UserCell = ({ user }) => {
    return _jsx("div", { children: _jsx("a", Object.assign({ target: '_blank', href: `${location.origin}/k/#/people/user/${user.code}` }, { children: user.name }), void 0) }, void 0);
};
export default UserCell;
