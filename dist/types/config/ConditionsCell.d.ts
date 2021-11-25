/// <reference types="react" />
import { DispatchParams } from "@kintone/kintone-ui-component/esm/react/Table";
import { OneOf } from "@kintone/rest-api-client/lib/KintoneFields/types/property";
interface IConditionsCellProp {
    value: {
        targetField: string;
        operator: string;
        selfField: string;
    }[];
    targetFields: OneOf[] | null;
    selfFields: OneOf[];
    onChange: (newState: DispatchParams) => void;
}
declare const ConditionsCell: (props: IConditionsCellProp) => JSX.Element;
export default ConditionsCell;
