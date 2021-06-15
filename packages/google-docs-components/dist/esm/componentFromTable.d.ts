import { ComponentData, ComponentDef } from "./types";
import { elementTypes } from "google-docs-parser";
import { ParseContent } from "./index";
declare type Table = elementTypes.table;
declare type Error = "TableFormatError" | "InvalidPropError" | "ComponentError";
export declare type ComponentParseError = {
    error: Error;
    message: string;
};
export default function (componentDefs: Array<ComponentDef>, table: Table, parseContent: ParseContent): ComponentData | ComponentParseError;
export {};
