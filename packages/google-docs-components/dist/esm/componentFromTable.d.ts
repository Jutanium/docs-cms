import { ComponentDef } from "./types";
import { elementTypes } from "google-docs-parser";
declare type Table = elementTypes.table;
export default function (components: Array<ComponentDef>, table: Table): void;
export {};
