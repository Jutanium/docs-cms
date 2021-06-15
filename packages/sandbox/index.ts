

import testFileOutput from "./testFileOutput.json"
import config from "./docsconfig.json"

import { getDoc, parseDoc, document } from "google-docs-parser"
import { componentsFromDoc } from "google-docs-components";
import * as fs from "fs";

const docId = "1SmWpErSKPupCDuq-jeqmIQqRbnz0WhuLKsXmRXLYSvo";

getDoc(config, docId).then(result => {
  const document = parseDoc(result);
  fs.writeFile("document.json", JSON.stringify(document), () => console.log);
  const components = componentsFromDoc({
    components: [
      {
        matchName: ["MyComponent", "My Component"],
        componentName: "MyComponent",
        props: {
          prop1: {
            type: "number",
            required: true
          },
          prop2: {
            type: "string",
            required: true
          }
        },
        slots: {
          slotExample: {}
        }
      },
      {
        matchName: ["Pullquote"],
        componentName: "Pullquote",
        slots: {
          default: {}
        }
      }
    ]
  }, document);
  fs.writeFile("components.json", JSON.stringify(components), () => console.log);
})


