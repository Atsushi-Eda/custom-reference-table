import React from 'react';
import {Connection, File} from '@kintone/kintone-js-sdk';
const kintoneFile = new File(new Connection);

const FilesCell = ({files}) => {
  const downloadFile = (name, fileKey) => {
    kintoneFile.download({fileKey}).then(blob => {
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = name;
      downloadLink.click();
    });
    return false;
  }
  return <div>{
    files.map(({name, fileKey, size}, i) =>
      <div key={i}><a onClick={() => downloadFile(name, fileKey)}>{name}</a> ({size} bytes)</div>
    )
  }</div>;
}
export default FilesCell;
