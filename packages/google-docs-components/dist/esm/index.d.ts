import type { document, element } from "google-docs-parser";
import { Config } from "./types";
import { ProcessedContent } from "./types";
export declare type ParseContent = (element: Array<element>) => ProcessedContent;
export declare type ProcessedDocument = {
    body: ProcessedContent;
    footnotes: {
        [index: number]: ProcessedContent;
    };
    readAt: number;
    title: string;
};
export declare function componentsFromDoc(config: Config, doc: document): ProcessedDocument;
