// import React from 'react';

const Cell = ({app, $id}) => {
  return <div><a target='_blank' href={`${location.origin}/k/${app}/show#record=${$id}`}>{$id}</a></div>
}
export default Cell;