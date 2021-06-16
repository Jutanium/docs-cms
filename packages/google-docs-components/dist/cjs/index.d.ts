import type { document, element } from "google-docs-parser";
import { ComponentData, Config, ElementData } from "./types";
export declare type ParseContent = (element: Array<element>) => Array<ElementData | ComponentData>;
export declare function componentsFromDoc(config: Config, doc: document): {
    footnotes: {
        [footnoteNumber: number]: (ElementData | ComponentData)[];
    };
    body: (ElementData | ComponentData)[];
    title: string;
    readAt: number;
};
