import type { document, elementTypes, element } from "google-docs-parser"
import {ComponentData, Config, ElementData} from "./types";
import componentFromTable, {ComponentParseError} from "./componentFromTable";

export type ParseContent = (element: Array<element>) => Array<ElementData | ComponentData>;

export function componentsFromDoc(config: Config, doc: document) {
  function processElement (element: element): ElementData | ComponentData | false {
    if (typeof element == "string") {
      return element;
    }

    if (element.type == "paragraph") {
      const paragraph = element as elementTypes.paragraph;
      const data: ElementData = {
        tag: "p",
        children: parseContent(paragraph.children),
      }
      return data;
    }

    if (element.type == "table") {
      const component = componentFromTable(config.components, element as elementTypes.table, parseContent);
      console.dir(component);
      if ("error" in component) {
        return false;
      }
      return component;
    }

    return false;
  }

  const parseContent: ParseContent = (elements) => {
    return elements.map(processElement).filter(Boolean) as Array<ElementData | ComponentData>;
  }

  if (doc) {
    console.log("hi from here")
    const processed = parseContent(doc.body);
    return processed;
  }
}