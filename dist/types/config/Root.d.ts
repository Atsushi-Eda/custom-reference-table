import React from 'react';
import { AppID } from "@kintone/rest-api-client/lib/client/types";
interface IRootPropsType {
    savedValue: ({
        app: AppID;
    } | any)[];
    selfFields: any;
    spaceIds: any;
}
export default class Root extends React.Component<IRootPropsType, {
    value: any;
    targetApps: {
        id: string;
        name: string;
        fields: any[] | null;
    }[];
}> {
    constructor(props: IRootPropsType);
    emptyTargetApp: {
        id: string;
        name: string;
        fields: null;
    };
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
