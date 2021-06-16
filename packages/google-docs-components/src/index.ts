import type { document, elementTypes, element } from "google-docs-parser"
import {ComponentData, Config, ElementData} from "./types";
import componentFromTable, {ComponentParseError} from "./componentFromTable";

export type ParseContent = (element: Array<element>) => Array<ElementData | ComponentData>;

export function componentsFromDoc(config: Config, doc: document) {

  const footnoteMap: { [id: string]: number } = {}

  function processElement (element: element): ElementData | ComponentData | false {
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

    if (element.type == "styledText") {
      const styledText = element as elementTypes.styledText;
      const data: ElementData = {
        element: "span",
        children: [styledText.html],
        style: styledText.css,
      }
      return data;
    }

    if (element.type == "table") {
      const component = componentFromTable(config.components, element as elementTypes.table, parseContent);
      if ("error" in component) {
        console.error(component.message);
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
    return elements.map(processElement).filter(Boolean) as Array<ElementData | ComponentData>;
  }

  if (doc) {
    const processedBody = parseContent(doc.body);


    let processedFootnotes: { [footnoteNumber: number]: Array<ElementData | ComponentData> };

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