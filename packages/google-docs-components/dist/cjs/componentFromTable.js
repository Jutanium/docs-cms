"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tableFormatError = message => ({
    error: "TableFormatError",
    message,
});
const invalidPropError = message => ({
    error: "InvalidPropError",
    message,
});
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
    let text = element.children[0];
    text = text
        .replace("\n", "")
        .replace(/<\/?\S>+/g, "")
        .trim();
    return text;
}
function verifySimpleCell(cell) {
    var _a;
    if (cell.length != 1) {
        return { errorMessage: "must have one piece of content" };
    }
    const element = cell[0];
    if (typeof element !== "string" &&
        ((element === null || element === void 0 ? void 0 : element.type) != "paragraph" || !((_a = element) === null || _a === void 0 ? void 0 : _a.simple))) {
        return { errorMessage: "must consist of a single, one-line paragraph with no complex formatting" };
    }
    return { element };
}
function default_1(componentDefs, table, parseContent) {
    var _a, _b;
    if (table.rows.some(row => row.length > 2)) {
        return tableFormatError("A row in the table has more than two entries");
    }
    const slotIndex = table.rows.slice(1).findIndex(row => row[0] == row[1]);
    if (slotIndex > -1 && slotIndex != table.rows.length - 1) {
        return tableFormatError("There's a default slot (a row with one entry) that isn't the last row");
    }
    const titleCell = table.cells[0];
    const verifyTitle = verifySimpleCell(titleCell);
    if ("errorMessage" in verifyTitle) {
        return tableFormatError("The title cell " + verifyTitle.errorMessage);
    }
    const titleElement = verifyTitle.element;
    const title = parseSimple(titleElement);
    const matchingDef = componentDefs.find(def => matchesName(def, title));
    if (!matchingDef) {
        return tableFormatError(`${title} isn't the name of a registered component`);
    }
    const returnData = {
        component: matchingDef.componentName
    };
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
            const keyString = parseSimple(keyElement);
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
            let value = parseSimple(verifyValue.element);
            if (matchingDef.props[matches.prop].type == "number") {
                value = Number(value);
            }
            if (!returnData.props) {
                returnData.props = {};
            }
            returnData.props[matches.prop] = value;
        }
    }
    return returnData;
}
exports.default = default_1;
//# sourceMappingURL=componentFromTable.js.map