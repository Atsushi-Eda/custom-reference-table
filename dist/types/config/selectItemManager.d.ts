export default class selectItemManager {
    static createItems(unFormattedItems: any, type?: string | null): {
        label: string;
        value: string;
    }[];
    static getValue({ unFormattedItems, value, type }: {
        unFormattedItems: any;
        value?: string;
        type?: string | null;
    }): string;
    static createItemsForFields(unFormattedItems: any): {
        label: string;
        value: string;
    }[];
    static getValueForFields(unFormattedItems: any, value?: string): string;
}
