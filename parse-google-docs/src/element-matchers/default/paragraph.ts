import {element, elementMatcher} from "../types";
import {docs_v1} from "googleapis";
import {styledText} from "./text";

type textContent = {
  simple?: true,
  children: Array<element>
}

export type paragraph = {
  type: "paragraph"
} & textContent;

type header = {
  type: "header"
  size: number,
} & textContent

export const paragraphMatcher: elementMatcher = {
  matchProperty: "paragraph",
  resolve(object, parseChild): paragraph | header | false {
    const paragraph = object as docs_v1.Schema$Paragraph;
    if (paragraph.elements) {
      const children: Array<element> = [];
      paragraph.elements.map(parseChild).forEach(el => {
        if (!el) return;

        if (el == "\n" || (el as styledText)?.html == "\n") return;

        const lastAdded = children.length && children[children.length - 1];
        if (typeof lastAdded == "string" && typeof el == "string") {
          children[children.length - 1] += el;
          return;
        }

        children.push(el);
      })

      if (children.length == 0)
        return false;

      const isSimple = children.length == 1 && typeof children[0] == "string";

      const properties: textContent = {
        children,
        ...(isSimple && {simple: true})
      }

      if (paragraph.paragraphStyle?.namedStyleType?.includes("HEADING")) {
        const size = Number(paragraph.paragraphStyle.namedStyleType.split('_')[1]);
        return {
          type: "header",
          size,
          ...properties
        }
      }

      return {
        type: "paragraph",
        ...properties
      }
    }
    return false;
  }
}