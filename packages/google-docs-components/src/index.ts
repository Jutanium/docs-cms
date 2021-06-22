import type { document, elementTypes, element } from "google-docs-parser"
import {ComponentData, Config, ContentData, ElementData, TableData} from "./types";
import { ProcessedContent} from "./types";
import componentsFromDoc from "./componentsFromDoc";

export type { ProcessedContent, ComponentData, ContentData, ElementData, TableData, Config };
export { componentsFromDoc }


