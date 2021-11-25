import { jsx as _jsx } from "react/jsx-runtime";
// import React from 'react';
const Cell = ({ app, $id }) => {
    return _jsx("div", { children: _jsx("a", Object.assign({ target: '_blank', href: `${location.origin}/k/${app}/show#record=${$id}` }, { children: $id }), void 0) }, void 0);
};
export default Cell;
