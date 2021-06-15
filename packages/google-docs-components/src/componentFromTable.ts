import {ComponentData, ComponentDef} from "./types";

import {element, elementTypes} from "google-docs-parser"
import {ParseContent} from "./index";

type Table = elementTypes.table;
type Paragraph = elementTypes.paragraph;


const tableFormatError: (message: string) => ComponentParseError = message => ({
    error: "TableFormatError",
    message,
  });

const invalidPropError: (message: string) => ComponentParseError = message => ({
  error: "InvalidPropError",
  message,
});

export type ComponentParseError = {
  error: "TableFormatError" | "InvalidPropError",
  message: string,
}

function matchesName(componentDef: ComponentDef, title: string) {
  const matchers = Array.isArray(componentDef.matchName) ? componentDef.matchName : [componentDef.matchName];

  if (matchers.find(matcher => matcher == title)) {
    return true;
  }

  return false;
}

function matchesPropOrSlot(componentDef: ComponentDef, key: string):
  {prop: string} | {slot: string} | false {
  const matchesKey = name => name.toLowerCase() == key.toLowerCase();
  const foundProp = Object.keys(componentDef.props).find(matchesKey);
  if (foundProp) {
    return {prop: foundProp};
  }
  const foundSlot = Object.keys(componentDef.slots).find(matchesKey);
  if (foundSlot) {
    return {slot: foundSlot};
  }
  return false;
}

function parseSimple(element: Paragraph) {
  let text = element.children[0] as string;
  text = text
    .replace("\n", "")
    .replace(/<\/?\S>+/g, "")
    .trim();
  return text;
}

function verifySimpleCell(cell: element[]): {errorMessage: string} | {element: element} {
  if (cell.length != 1) {
    return {errorMessage: "must have one piece of content"}
  }

  const element = cell[0];
  if (typeof element !== "string" &&
    (element?.type != "paragraph" || !(element as Paragraph)?.simple)) {
    return {errorMessage: "must consist of a single, one-line paragraph with no complex formatting"};
  }

  return {element};
}

export default function (componentDefs: Array<ComponentDef>, table: Table,
                         parseContent: ParseContent)
  : ComponentData | ComponentParseError {

  if (table.rows.some(row => row.length > 2)) {
    return tableFormatError("A row in the table has more than two entries");
  }

  const slotIndex = table.rows.slice(1).findIndex(row => row[0] == row[1]);
  if (slotIndex > -1 && slotIndex != table.rows.length - 1) {
    return tableFormatError("There's a default slot (a row with one entry) that isn't the last row")
  }

  const titleCell = table.cells[0];

  const verifyTitle = verifySimpleCell(titleCell);
  if ("errorMessage" in verifyTitle) {
    return tableFormatError("The title cell " + verifyTitle.errorMessage)
  }

  const titleElement = verifyTitle.element;

  const title = parseSimple(titleElement as Paragraph);

  const matchingDef = componentDefs.find(def => matchesName(def, title));

  const returnData: ComponentData = {
    definition: matchingDef
  }

  const keyValueRows = table.rows.slice(1, slotIndex > -1 ? slotIndex : table.rows.length);

  if (keyValueRows.length) {
    for (let i = keyValueRows.length - 1; i >= 0; i--) {
      const row = keyValueRows[i];

      const keyCell = table.cells[row[0]];
      const verifyKey = verifySimpleCell(keyCell);
      if ("errorMessage" in verifyKey) {
        return tableFormatError(`Row #${i + 2}'s first cell is a prop or slot key cell. It ${verifyKey.errorMessage}`);
      }
      const keyElement = verifyKey.element;
      const keyString = parseSimple(keyElement as Paragraph);
      const matches = matchesPropOrSlot(matchingDef, keyString);
      if (!matches) {
        return invalidPropError(`Key ${keyString} on row #${i + 2} doesn't match a prop or slot on component ${matchingDef.componentName}`);
      }

      const valueCell = table.cells[row[1]];
      console.log("valueCell", valueCell)
      if ("slot" in matches) {
        if (returnData.slots?.[matches.slot]) {
          return invalidPropError(`Slot ${matches.slot} cannot be set twice.`)
        }
        if (!returnData.slots) {
          returnData.slots = {};
        }
        returnData.slots[matches.slot] = parseContent(valueCell);
        continue;
      }

      if (returnData.props?.[matches.prop]) {
        return invalidPropError(`Prop ${matches.prop} cannot be set twice.`);
      }

      const verifyValue = verifySimpleCell(valueCell);

      if ("errorMessage" in verifyValue) {
        return invalidPropError(`The value for prop ${matches.prop} is invalid. It ${verifyValue.errorMessage}`);
      }
      let value: string | number = parseSimple(verifyValue.element as Paragraph);
      if (matchingDef.props[matches.prop].type == "number") {
        value = Number(value);
      }

      if (!returnData.props) {
        returnData.props = {};
      }
      console.log("got to setting prop")
      returnData.props[matches.prop] = value;
    }
  }

  return returnData;
}
