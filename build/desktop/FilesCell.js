import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// import React from 'react';
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
    return _jsx("div", { children: files.map(({ name, fileKey, size }, i) => _jsxs("div", { children: [_jsx("a", Object.assign({ onClick: () => downloadFile(name, fileKey) }, { children: name }), void 0), " (", size, " bytes)"] }, i)) }, void 0);
};
export default FilesCell;
