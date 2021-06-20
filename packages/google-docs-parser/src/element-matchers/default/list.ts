import {elementMatcher, element} from "../types";
import {rawList} from "../../listParsing";
import {docs_v1} from "@googleapis/docs";
import Schema$Paragraph = docs_v1.Schema$Paragraph;

export type list = {
  type: "list",
  ordered: boolean,
  items: Array<element>
}


export const listMatcher: elementMatcher = {
  matchProperty: "list",
  resolve(object, parseChildren): list | false {
    const rawList = object as rawList;

    const makeList = (items: Array<{ paragraph: Schema$Paragraph }>, depth = 0): list => {
      const ordered = !!rawList.listProperties.nestingLevels[depth].glyphType;

      const children = [];

      let i = 0;
      while (i < items.length) {
        const curr = items[0];
        const currDepth = curr.paragraph.bullet.nestingLevel || 0;
        if (currDepth > depth) {
          const sublistStart = i;
          let sublistEnd = i + items.slice(i).findIndex(
            (item, i, arr) => i == arr.length - 1 || item.paragraph.bullet.nestingLevel < currDepth);
          const sublist = makeList(items.slice(sublistStart, sublistEnd + 1), currDepth);
          children.push(sublist);
          i = sublistEnd + 1;
          continue;
        }
        children.push(curr);
      }

      return {
        type: "list",
        ordered,
        items: children
      }
    }


    return makeList(rawList.items);
  }
}
