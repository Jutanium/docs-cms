"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDoc = exports.parseContentArray = void 0;
const default_1 = require("./element-matchers/default");
const listParsing_1 = require("./listParsing");
let usingMatchers = default_1.elementMatchers;
function parseContent(obj) {
    const matcher = usingMatchers
        .find(matcher => matcher.matchProperty in obj);
    if (matcher) {
        return matcher.resolve(obj[matcher.matchProperty], parseContentArray);
    }
    return Object.assign({ type: "unmatched" }, obj);
}
function parseContentArray(contentArray) {
    return listParsing_1.extractLists(contentArray).map(c => parseContent(c)).filter(Boolean);
}
exports.parseContentArray = parseContentArray;
function parseDoc(doc, elementMatchers = undefined) {
    if (elementMatchers) {
        usingMatchers = elementMatchers;
    }
    if (!doc)
        return;
    listParsing_1.registerLists(doc);
    const body = parseContentArray(doc.body.content);
    const footnotes = doc.footnotes && Object.fromEntries(Object.entries(doc.footnotes)
        .map(([footnoteId, data]) => ([footnoteId, parseContentArray(data.content)])));
    const returnDoc = Object.assign({ readAt: Date.now(), title: doc.title, body }, (footnotes && { footnotes }));
    return returnDoc;
}
exports.parseDoc = parseDoc;
//# sourceMappingURL=parse.js.map