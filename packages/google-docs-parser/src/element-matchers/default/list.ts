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
        const curr = items[i];
        const currDepth = curr.paragraph.bullet.nestingLevel || 0;
        if (currDepth > depth) {

          let sublistItems = [];

          while (i < items.length && items[i].paragraph.bullet.nestingLevel >= currDepth) {
            sublistItems.push(items[i]);
            i++;
          }

          const sublist = makeList(sublistItems, currDepth);

          children.push(sublist);
          continue;
        }
        children.push(curr);
        i++;
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
