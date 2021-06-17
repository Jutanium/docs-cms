import type { document, element } from "google-docs-parser";
import { ComponentData, Config, ContentData, ElementData } from "./types";
import { ProcessedContent } from "./types";
export declare type ParseContent = (element: Array<element>) => ProcessedContent;
export type { ProcessedContent, ComponentData, ContentData, ElementData, Config };
export declare type ProcessedDocument = {
    body: ProcessedContent;
    footnotes: {
        [index: number]: ProcessedContent;
    };
    readAt: number;
    title: string;
};
export declare function componentsFromDoc(config: Config, doc: document): ProcessedDocument;
