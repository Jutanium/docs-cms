declare type ValidatorFunction = (value: string) => boolean;
export declare type Props = {
    [propName: string]: {
        type: 'string' | 'number';
        validator?: ValidatorFunction;
    };
};
export declare type Slots = {
    [slotName: string]: {
        validator?: ValidatorFunction;
    };
};
export declare type ComponentDef = {
    matchName: string | Array<string>;
    componentName: string;
    props?: Props;
    slots?: Slots;
};
export declare type Config = {
    components: Array<ComponentDef>;
};
export {};
