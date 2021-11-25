// @ts-ignore
import React from 'react';
const Cell = ({ app, $id }) => {
    return React.createElement("div", null,
        React.createElement("a", { target: '_blank', href: `${location.origin}/k/${app}/show#record=${$id}` }, $id));
};
export default Cell;
