import React from 'react';
import { AppID } from "@kintone/rest-api-client/lib/client/types";
import { OneOf } from "@kintone/rest-api-client/lib/KintoneFields/types/property";
interface IRootPropsType {
    savedValue: {
        app: AppID;
    }[];
    selfFields: OneOf[];
    spaceIds: string[];
}
interface ITargetApp {
    id: string;
    name: string;
    fields: OneOf[] | null;
}
export default class Root extends React.Component<IRootPropsType, {
    value: ({
        app: AppID;
        space: string;
    } | any)[];
    targetApps: ITargetApp[];
}> {
    constructor(props: IRootPropsType);
    emptyTargetApp: ITargetApp;
    addTargetApp: (targetApp: any, rowIndex: any) => void;
    addEmptyTargetApp: (rowIndex: any) => void;
    removeTargetApp: (rowIndex: any) => void;
    editTargetApp: (targetApp: any, rowIndex: any) => void;
    searchApp: (appId: any, rowIndex: any) => void;
    handleRowAdd: ({ data, rowIndex }: DispatchParams) => void;
    handleRowRemove: ({ data, rowIndex }: DispatchParams) => void;
    handleCellChange: ({ data }: {
        data: any;
    }) => void;
    save: () => void;
    render(): JSX.Element;
}
export {};
