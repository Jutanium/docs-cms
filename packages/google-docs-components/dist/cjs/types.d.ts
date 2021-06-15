export declare type ElementData = string | {
    tag: string;
    children: Array<ElementData | ComponentData>;
};
declare type ValidatorFunction = (value: string) => boolean;
export declare type PropsDef = {
    [propName: string]: {
        type: 'string' | 'number';
        validator?: ValidatorFunction;
    };
};
export declare type PropsData = {
    [propName: string]: string | number;
};
export declare type SlotsDef = {
    default?: {
        validator?: ValidatorFunction;
    };
    [slotName: string]: {
        validator?: ValidatorFunction;
    };
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
    definition: ComponentDef;
    props?: PropsData;
    slots?: SlotsData;
};
export declare type Config = {
    components: Array<ComponentDef>;
};
export {};
