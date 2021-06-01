
import {docs_v1} from "googleapis";
import * as fs from "fs";

function unwrapBody(body: docs_v1.Schema$Body) {
  fs.writeFileSync('./data.json', JSON.stringify(body.content, null, 2) , 'utf-8');
}

export function parseDoc(doc: docs_v1.Schema$Document) {

  if (doc.body) {
    unwrapBody(doc.body);
  }
}