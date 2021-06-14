"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.elementMatchers = void 0;
const paragraph_1 = require("./paragraph");
const text_1 = require("./text");
const table_1 = require("./table");
const footnote_1 = require("./footnote");
exports.elementMatchers = [paragraph_1.paragraphMatcher, table_1.tableMatcher, text_1.textRunMatcher, footnote_1.footnoteReferenceMatcher];
//# sourceMappingURL=index.js.map