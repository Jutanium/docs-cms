import type { document, elementTypes, element } from "google-docs-parser"
import {Config} from "./types";
import componentFromTable from "./componentFromTable";


export function componentsFromDoc(config: Config, doc: document) {
  function processElement (element: element) {
    if (typeof element == "string") {

      return;
    }

    if (element.type == "table") {
      return componentFromTable(config.components, element as elementTypes.table);
    }
  }

  if (doc) {
    console.log("hi from here")
    const processed = doc.body.map(processElement);
  }
}