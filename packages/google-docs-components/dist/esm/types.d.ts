export declare type ElementData = string | {
    element: string;
    children: Array<ElementData | ComponentData>;
    style?: {
        [propertyName: string]: string | number;
    };
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
    default?: Array<ComponentData | ElementData>;
    [propName: string]: Array<ComponentData | ElementData>;
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
