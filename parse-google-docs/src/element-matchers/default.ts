import {elementMatcher} from "./types";
import {docs_v1} from "googleapis";

const paragraphMatcher: elementMatcher = {
  matchProperty: "paragraph",
  resolve (object, parseChild) {
    const paragraph = object as docs_v1.Schema$Paragraph;
    if (paragraph.elements) {
      return {
        paragraph: {
          children: paragraph.elements.map(parseChild).filter(child => child)
        }
      }
    }
    return false;
  }
}

const textRunMatcher: elementMatcher = {
  matchProperty: "textRun",
  resolve (object, parseChild) {
    const text = object as docs_v1.Schema$TextRun;
    if (text.content) {
      return text.content;
    }
    return false;
  }
}

const tableMatcher: elementMatcher = {
  matchProperty: "table",
  resolve (object, parseChild) {
    const table = object as docs_v1.Schema$Table;
    if (!table.tableRows?.length) return false;
    const rows = table.tableRows.map (row => {
      const cells = row.tableCells;
      // @ts-ignore
      return cells.map(cell => cell.content.map(content => parseChild(content)))
    });
    return {
      table: {
        rows
      }
    };
    return false;
  }
}

export default [paragraphMatcher, tableMatcher, textRunMatcher];
