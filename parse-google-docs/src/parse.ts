
import {docs_v1} from "googleapis";
import * as fs from "fs";
import matchers from "./element-matchers/default";
import {elementMatcher} from "./element-matchers/types";

function parseBody(body: docs_v1.Schema$Body) {
  fs.writeFileSync('./data.json', JSON.stringify(body.content, null, 2) , 'utf-8');

  if (!body.content) return;
  const parsed = body.content.map(c => parseContent(c));

  fs.writeFileSync('./processed.json', JSON.stringify(parsed, null, 2) , 'utf-8');
}

export function parseContent(obj: any): object | string | false {
  const matcher: elementMatcher | undefined = matchers
          .find(matcher => matcher.matchProperty in obj);
  if (matcher) {
    const resolved = matcher.resolve(obj[matcher.matchProperty], parseContent);
    return resolved || false;
  }
  return {
    unmatched: obj
  }
}

export function parseDoc(doc: docs_v1.Schema$Document) {

  if (doc.body) {
    parseBody(doc.body);
  }
}