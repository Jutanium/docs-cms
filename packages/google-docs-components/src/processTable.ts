import {ComponentData, ComponentDef, DevSlotData} from "./types";

import {element, elementTypes} from "google-docs-parser"
import {ParseContent} from "./index";
import exp from "constants";

type Table = elementTypes.table;
type Paragraph = elementTypes.paragraph;


const [ invalidPropError, tableFormatError, componentError] = ["InvalidPropError", "TableFormatError", "ComponentError"]
  .map( (error: Error) => (message: string) => ({ error, message }));

type Error = "TableFormatError" | "InvalidPropError" | "ComponentError";
export type ComponentParseError = {
  error: Error,
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

export function parseSimple(element: Paragraph) {
  let text = element.children[0] as string;
  text = text
    .replace("\n", "")
    .replace(/<\/?\S>+/g, "")
    .trim();
  return text;
}

export function verifySimpleCell(cell: element[]): {errorMessage: string} | {element: element} {
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
  : ComponentData | DevSlotData | ComponentParseError {

  if (table.rows.some(row => row.length > 2)) {
    return tableFormatError("A row in the table has more than two entries");
  }

  const titleCell = table.cells[0];

  const verifyTitle = verifySimpleCell(titleCell);
  if ("errorMessage" in verifyTitle) {
    return tableFormatError(`The dev slot or title cell ${verifyTitle.errorMessage})`);
  }

  const titleElement = verifyTitle.element;

  const title = parseSimple(titleElement as Paragraph);

  console.log("Parsing " + title);

  const matchingDef = componentDefs.find(def => matchesName(def, title));

  if (!matchingDef) {
    if (table.rows.length == 1) {
      return {
        slot: title
      }
    }
    return componentError(`${title} isn't the name of a registered component`);
  }


  const returnData: ComponentData = {
    component: matchingDef.componentName
  }

  const isSlot = row => (row.length == 1 || row[0] == row[1]);
  const defaultSlotIndex = table.rows.findIndex((row,index) => (index > 0) && isSlot(row));
  if (defaultSlotIndex > -1) {
    if (defaultSlotIndex != table.rows.length - 1)
      return tableFormatError("There's a default slot (a row with one entry) that isn't the last row")
    if (!("default" in matchingDef.slots)) {
      return componentError(`A default slot was passed, but there was no default slot specified for ${title}`);
    }
    const cellIndex = table.rows[defaultSlotIndex][0];
    returnData.slots = {
      default: parseContent(table.cells[cellIndex])
    }
  }

  const requiredProps = new Set();
  if (matchingDef.props) {
    Object.keys(matchingDef.props).forEach(prop => {
      if (matchingDef.props[prop].required) {
        requiredProps.add(prop);
      }
    });
  }

  const keyValueRows = table.rows.slice(1, defaultSlotIndex > -1 ? defaultSlotIndex : table.rows.length);

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
        return tableFormatError(`The value cell for prop ${matches.prop} isn't formatted correctly. It ${verifyValue.errorMessage}`);
      }

      let value: string | number = parseSimple(verifyValue.element as Paragraph);
      if (matchingDef.props[matches.prop].type == "number") {
        value = Number(value);
      }

      if (!returnData.props) {
        returnData.props = {};
      }
      returnData.props[matches.prop] = value;
      requiredProps.delete(matches.prop);
    }
  }

  if (requiredProps.size > 0) {
    const string = Array.from(requiredProps).join(", ");
    return componentError("Missing required props: " + string);
  }

  return returnData;
}
