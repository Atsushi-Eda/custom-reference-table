// @ts-ignore
import React from 'react';
// import {Connection, File} from '@kintone/kintone-js-sdk';
// const kintoneFile = new File(new Connection);
import { KintoneRestAPIClient } from '@kintone/rest-api-client';
const kintoneRestAPIClient = new KintoneRestAPIClient();
const FilesCell = ({ files }) => {
    const downloadFile = (name, fileKey) => {
        kintoneRestAPIClient.file.downloadFile({ fileKey }).then(blob => {
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = name;
            downloadLink.click();
        });
        return false;
    };
    return React.createElement("div", null, files.map(({ name, fileKey, size }, i) => React.createElement("div", { key: i },
        React.createElement("a", { onClick: () => downloadFile(name, fileKey) }, name),
        " (",
        size,
        " bytes)")));
};
export default FilesCell;
