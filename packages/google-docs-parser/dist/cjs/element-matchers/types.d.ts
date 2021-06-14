import { parseContent } from "../parse";
export declare type element = {
    type: string;
} | string;
export declare type elementMatcher = {
    matchProperty: string;
    resolve: (object: object, parseChild: typeof parseContent) => element | false;
};
