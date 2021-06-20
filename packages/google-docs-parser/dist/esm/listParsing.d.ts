import { docs_v1 } from "@googleapis/docs";
export declare type rawList = {
    items: Array<{
        paragraph: docs_v1.Schema$Paragraph;
    }>;
    listProperties: docs_v1.Schema$ListProperties;
};
export declare function registerLists(document: docs_v1.Schema$Document): void;
export declare function extractLists(contentArray: Array<object>): any[];
