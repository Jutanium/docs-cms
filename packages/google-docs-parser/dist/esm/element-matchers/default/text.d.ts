import { elementMatcher } from "../types";
declare type textCSS = {
    color?: string;
    "background-color"?: string;
    "font-family"?: string;
    "font-weight"?: number;
    "font-size"?: string;
};
export declare type styledText = {
    type: "styledText";
    html: string;
    css: textCSS;
};
export declare const textRunMatcher: elementMatcher;
export {};
