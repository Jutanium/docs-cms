import type { document, elementTypes, element } from "google-docs-parser"
import {ComponentData, Config, ElementData} from "./types";
import componentFromTable, {ComponentParseError} from "./componentFromTable";

export type ParseContent = (element: Array<element>) => Array<ElementData | ComponentData>;

export function componentsFromDoc(config: Config, doc: document) {
  function processElement (element: element) {
    if (typeof element == "string") {
      return element;
    }

    if (element.type == "table") {
      const component = componentFromTable(config.components, element as elementTypes.table, parseContent);
      console.log(component);
      return component;
    }
    return element;
  }

  const parseContent: ParseContent = (elements) => {
    return elements.map(processElement);
  }

  if (doc) {
    console.log("hi from here")
    const processed = parseContent(doc.body);
  }
}