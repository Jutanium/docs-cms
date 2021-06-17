export declare type ContentData = ElementData | ComponentData | DevSlotData;
export declare type ProcessedContent = Array<ContentData>;
export declare type ElementData = string | {
    element: string;
    children: ProcessedContent;
    style?: {
        [propertyName: string]: string | number;
    };
    attrs?: {
        href?: string;
    };
};
export declare type DevSlotData = {
    slot: string;
};
export declare type PropsDef = {
    [propName: string]: {
        type: 'string' | 'number';
        required?: boolean;
    };
};
export declare type PropsData = {
    [propName: string]: string | number;
};
export declare type SlotsDef = {
    default?: {};
    [slotName: string]: {};
};
export declare type SlotsData = {
    default?: ProcessedContent;
    [propName: string]: ProcessedContent;
};
export declare type ComponentDef = {
    matchName: string | Array<string>;
    componentName: string;
    props?: PropsDef;
    slots?: SlotsDef;
};
export declare type ComponentData = {
    component: string;
    props?: PropsData;
    slots?: SlotsData;
};
export declare type Config = {
    components: Array<ComponentDef>;
};
