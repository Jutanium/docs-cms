
import {docs_v1} from "googleapis";
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

export function parseContentArray(contentArray: Array<object>): Array<element> {
  return contentArray.map(c => parseContent(c)).filter(Boolean) as Array<element>;
}

type document = {
  title: string,
  body: Array<element>,
  footnotes?: {
    [footnoteId: string]: Array<element>
  }
}

export function parseDoc(doc: docs_v1.Schema$Document, elementMatchers: Array<elementMatcher> | undefined) {
  if (elementMatchers) {
    usingMatchers = elementMatchers;
  }

  if (!doc) return;


  const body = parseContentArray(doc.body!.content!);

  const footnotes = doc.footnotes && Object.fromEntries(
    Object.entries(doc.footnotes)
      .map( ([footnoteId, data]) =>
        ([footnoteId, parseContentArray(data.content!)])
      )
  );

  const returnDoc: document = {
    title: doc.title!,
    body,
    ...(footnotes && {footnotes})
  }

  return returnDoc;
}