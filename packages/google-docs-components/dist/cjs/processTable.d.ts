import { ComponentData, ComponentDef, DevSlotData } from "./types";
import { element, elementTypes } from "google-docs-parser";
import { ParseContent } from "./index";
declare type Table = elementTypes.table;
declare type Paragraph = elementTypes.paragraph;
declare type Error = "TableFormatError" | "InvalidPropError" | "ComponentError";
export declare type ComponentParseError = {
    error: Error;
    message: string;
};
export declare function parseSimple(element: Paragraph): string;
export declare function verifySimpleCell(cell: element[]): {
    errorMessage: string;
} | {
    element: element;
};
export default function (componentDefs: Array<ComponentDef>, table: Table, parseContent: ParseContent): ComponentData | DevSlotData | ComponentParseError;
export {};
