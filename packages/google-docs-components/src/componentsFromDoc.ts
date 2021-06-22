import type { ProcessedDocument, ProcessedContent} from "./types";
import {Config, ContentData, ElementData, TableData} from "./types";
import {document, element, elementTypes} from "google-docs-parser";
import componentFromTable from "./processTable";

export type ParseContent = (element: Array<element>) => ProcessedContent;

export default function componentsFromDoc(config: Config, doc: document): ProcessedDocument {
  const footnoteMap: { [id: string]: number } = {}

  function processElement (element: element): ContentData | false {
    if (typeof element == "string") {
      return element;
    }

    if (element.type == "paragraph") {
      const paragraph = element as elementTypes.paragraph;
      const data: ElementData = {
        element: "p",
        children: parseContent(paragraph.children),
      }
      return data;
    }

    if (element.type == "list") {
      const list = element as elementTypes.list;
      const tag = list.ordered ? "ol" : "ul";

      const toListItems = (elements) => {
        const listItems = [];
        elements.forEach( (child) => {
          if (listItems.length && child?.element == "ul" || child.element == "ol") {
            listItems[listItems.length - 1].children.push(child);
            return;
          }

          if (child.children) {
            //Google Docs considers list items as paragraphs, but we don't want that in our html
            listItems.push(Object.assign({}, child, {element: "li"}))
            return;
          }
          listItems.push({
            element: "li",
            children: [child]
          })
        })
        return listItems;
      }

      const data: ElementData = {
        element: tag,
        children: toListItems(parseContent(list.items))
      }
      return data;
    }

    if (element.type == "styledText") {
      const styledText = element as elementTypes.styledText;
      const tag = styledText.link ? "a" : "span";
      const data: ElementData = {
        element: tag,
        children: [styledText.text],
        style: styledText.css,
        ...(styledText.link && {attrs: {href: styledText.link}})
      }
      return data;
    }

    if (element.type == "table") {
      const table = element as elementTypes.table;
      const component = componentFromTable(config.components, table, parseContent);
      if ("error" in component) {
        console.error(component.message);
        if (component.error == "ComponentNotFoundError") {
          const data: TableData = {
            rows: table.rows,
            cells: table.cells.map(parseContent)
          }
          return data;
        }
        return false;
      }
      return component;
    }

    if (element.type == "footnoteReference") {
      const { footnoteNumber, footnoteId } = element as elementTypes.footnoteReference;
      footnoteMap[footnoteId] = footnoteNumber;
      return {
        component: "FootnoteReference",
        props: {
          footnoteNumber: footnoteNumber
        }
      }
    }
    return false;
  }

  const parseContent: ParseContent = (elements) => {
    if (Array.isArray(elements)) {
      return elements.map(processElement).filter(Boolean) as ProcessedContent;
    }
  }

  if (doc) {
    const processedBody = parseContent(doc.body);


    let processedFootnotes: { [footnoteNumber: number]: ProcessedContent };

    if (doc.footnotes) {
      const footnoteContent = (footnoteId) => {
        const footnote = doc.footnotes[footnoteId];
        if (!footnote) return false;
        return parseContent(footnote);
      }
      const footnoteEntries = Object.entries(footnoteMap).map(
        ([footnoteId, footnoteNumber]) => ([footnoteNumber, footnoteContent(footnoteId)])
      );
      processedFootnotes = Object.fromEntries(footnoteEntries);
    }

    return {
      body: processedBody,
      title: doc.title,
      readAt: doc.readAt,
      ...(processedFootnotes && {footnotes: processedFootnotes})
    };

  }
}
