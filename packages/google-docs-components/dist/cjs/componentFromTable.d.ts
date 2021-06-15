import { ComponentData, ComponentDef } from "./types";
import { elementTypes } from "google-docs-parser";
import { ParseContent } from "./index";
declare type Table = elementTypes.table;
export declare type ComponentParseError = {
    error: "TableFormatError" | "InvalidPropError";
    message: string;
};
export default function (componentDefs: Array<ComponentDef>, table: Table, parseContent: ParseContent): ComponentData | ComponentParseError;
export {};
