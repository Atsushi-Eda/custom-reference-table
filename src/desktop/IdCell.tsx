// @ts-ignore
import React from 'react';
import type { AppID } from "@kintone/rest-api-client/lib/client/types";

const Cell = ({app, $id}: {app: AppID, $id: string}) => {
  return <div><a target='_blank' href={`${location.origin}/k/${app}/show#record=${$id}`}>{$id}</a></div>
}
export default Cell;