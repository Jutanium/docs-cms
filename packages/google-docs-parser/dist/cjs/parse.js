"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDoc = exports.parseContentArray = exports.parseContent = void 0;
const default_1 = require("./element-matchers/default");
let usingMatchers = default_1.elementMatchers;
function parseContent(obj) {
    const matcher = usingMatchers
        .find(matcher => matcher.matchProperty in obj);
    if (matcher) {
        return matcher.resolve(obj[matcher.matchProperty], parseContent);
    }
    return Object.assign({ type: "unmatched" }, obj);
}
exports.parseContent = parseContent;
function parseContentArray(contentArray) {
    return contentArray.map(c => parseContent(c)).filter(Boolean);
}
exports.parseContentArray = parseContentArray;
function parseDoc(doc, elementMatchers = undefined) {
    if (elementMatchers) {
        usingMatchers = elementMatchers;
    }
    if (!doc)
        return;
    const body = parseContentArray(doc.body.content);
    const footnotes = doc.footnotes && Object.fromEntries(Object.entries(doc.footnotes)
        .map(([footnoteId, data]) => ([footnoteId, parseContentArray(data.content)])));
    const returnDoc = Object.assign({ readAt: Date.now(), title: doc.title, body }, (footnotes && { footnotes }));
    return returnDoc;
}
exports.parseDoc = parseDoc;
//# sourceMappingURL=parse.js.map