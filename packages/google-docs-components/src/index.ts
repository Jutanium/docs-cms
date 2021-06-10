import type { document, elementTypes } from "google-docs-parser"

export function componentsFromDoc(doc: document) {
  if (doc) {
    console.log(doc.body);
  }
}