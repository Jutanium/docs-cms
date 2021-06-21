import { ComponentData, ComponentDef, DevSlotData } from "./types";
import { elementTypes } from "google-docs-parser";
import { ParseContent } from "./index";
declare type Table = elementTypes.table;
export declare type ComponentParseErrorType = "TableFormatError" | "InvalidPropError" | "ComponentError" | "ComponentNotFoundError";
export declare type ComponentParseError = {
    error: ComponentParseErrorType;
    message: string;
};
export default function (componentDefs: Array<ComponentDef>, table: Table, parseContent: ParseContent): ComponentData | DevSlotData | ComponentParseError;
export {};
