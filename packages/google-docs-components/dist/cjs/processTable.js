"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const [invalidPropError, tableFormatError, componentError] = ["InvalidPropError", "TableFormatError", "ComponentError"]
    .map((error) => (message) => ({ error, message }));
function matchesName(componentDef, title) {
    const matchers = Array.isArray(componentDef.matchName) ? componentDef.matchName : [componentDef.matchName];
    if (matchers.find(matcher => matcher == title)) {
        return true;
    }
    return false;
}
function matchesPropOrSlot(componentDef, key) {
    const matchesKey = name => name.toLowerCase() == key.toLowerCase();
    const foundProp = Object.keys(componentDef.props).find(matchesKey);
    if (foundProp) {
        return { prop: foundProp };
    }
    const foundSlot = Object.keys(componentDef.slots).find(matchesKey);
    if (foundSlot) {
        return { slot: foundSlot };
    }
    return false;
}
function parseSimple(element) {
    if (element.children.length != 1) {
        return false;
    }
    const loneChild = element.children[0];
    let text;
    if (typeof loneChild == "string") {
        text = loneChild;
    }
    else if ("text" in loneChild) {
        text = loneChild.text;
    }
    else {
        return false;
    }
    text = text
        .replace("\n", "")
        .trim();
    return text;
}
function verifySimpleCell(cell) {
    if (cell.length != 1) {
        return { errorMessage: "must have one paragraph of content" };
    }
    const element = cell[0];
    if (typeof element === "string") {
        //Probably impossible, as Docs seems to always consider text within a cell as a paragraph
        return { text: element };
    }
    if ((element === null || element === void 0 ? void 0 : element.type) === "paragraph") {
        const tryToParse = parseSimple(element);
        if (tryToParse === false) {
            return { errorMessage: "must consist of a single line with uniform styling." };
        }
        return { text: tryToParse };
    }
    return { errorMessage: "must consist of a single, one-line paragraph." };
}
function default_1(componentDefs, table, parseContent) {
    var _a, _b;
    if (table.rows.some(row => row.length > 2)) {
        return tableFormatError("A row in the table has more than two entries");
    }
    const titleCell = table.cells[0];
    const verifyTitle = verifySimpleCell(titleCell);
    if ("errorMessage" in verifyTitle) {
        return tableFormatError(`The dev slot or title cell ${verifyTitle.errorMessage})`);
    }
    const title = verifyTitle.text;
    console.log("Parsing " + title);
    const matchingDef = componentDefs.find(def => matchesName(def, title));
    if (!matchingDef) {
        if (table.rows.length == 1) {
            return {
                slot: title
            };
        }
        return componentError(`${title} isn't the name of a registered component`);
    }
    const returnData = {
        component: matchingDef.componentName
    };
    const isSlot = row => (row.length == 1 || row[0] == row[1]);
    const defaultSlotIndex = table.rows.findIndex((row, index) => (index > 0) && isSlot(row));
    if (defaultSlotIndex > -1) {
        if (defaultSlotIndex != table.rows.length - 1)
            return tableFormatError("There's a default slot (a row with one entry) that isn't the last row");
        if (!("default" in matchingDef.slots)) {
            return componentError(`A default slot was passed, but there was no default slot specified for ${title}`);
        }
        const cellIndex = table.rows[defaultSlotIndex][0];
        returnData.slots = {
            default: parseContent(table.cells[cellIndex])
        };
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
            const keyString = verifyKey.text;
            const matches = matchesPropOrSlot(matchingDef, keyString);
            if (!matches) {
                return invalidPropError(`Key ${keyString} on row #${i + 2} doesn't match a prop or slot on component ${matchingDef.componentName}`);
            }
            const valueCell = table.cells[row[1]];
            if ("slot" in matches) {
                if ((_a = returnData.slots) === null || _a === void 0 ? void 0 : _a[matches.slot]) {
                    return invalidPropError(`Slot ${matches.slot} cannot be set twice.`);
                }
                if (!returnData.slots) {
                    returnData.slots = {};
                }
                returnData.slots[matches.slot] = parseContent(valueCell);
                continue;
            }
            if ((_b = returnData.props) === null || _b === void 0 ? void 0 : _b[matches.prop]) {
                return invalidPropError(`Prop ${matches.prop} cannot be set twice.`);
            }
            const verifyValue = verifySimpleCell(valueCell);
            if ("errorMessage" in verifyValue) {
                return tableFormatError(`The value cell for prop ${matches.prop} isn't formatted correctly. It ${verifyValue.errorMessage}`);
            }
            let value = verifyValue.text;
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
exports.default = default_1;
//# sourceMappingURL=processTable.js.map