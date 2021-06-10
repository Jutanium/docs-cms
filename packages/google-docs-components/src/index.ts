import type { document, elementTypes } from "google-docs-parser"

export function componentsFromDoc(doc: document) {
  console.log(doc.body);
}