import type { document, element } from "google-docs-parser";
import { ComponentData, Config, ElementData } from "./types";
export declare type ParseContent = (element: Array<element>) => Array<ElementData | ComponentData>;
export declare function componentsFromDoc(config: Config, doc: document): void;
