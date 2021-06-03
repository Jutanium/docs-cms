
import {docs_v1} from "googleapis";
import * as fs from "fs";
import matchers from "./element-matchers/default";
import {element, elementMatcher} from "./element-matchers/types";

let usingMatchers = matchers;
export function parseContent(obj: any): element | false {
  const matcher: elementMatcher | undefined = matchers
          .find(matcher => matcher.matchProperty in obj);
  if (matcher) {
    return matcher.resolve(obj[matcher.matchProperty], parseContent);
  }
  return {
    type: "unmatched",
      ...obj
  }
}

export function parseDoc(doc: docs_v1.Schema$Document, elementMatchers: Array<elementMatcher> | undefined) {
  if (elementMatchers) {
    usingMatchers = elementMatchers;
  }
  if (doc.body) {
    fs.writeFileSync('./data.json', JSON.stringify(doc.body.content, null, 2) , 'utf-8');

    if (!doc.body.content) return;
    const parsed = doc.body.content.map(c => parseContent(c)).filter(el => el);

    fs.writeFileSync('./processed.json', JSON.stringify(parsed, null, 2) , 'utf-8');
  }
}