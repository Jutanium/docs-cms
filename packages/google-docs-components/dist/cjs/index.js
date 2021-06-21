"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.componentsFromDoc = void 0;
const processTable_1 = __importDefault(require("./processTable"));
function componentsFromDoc(config, doc) {
    const footnoteMap = {};
    function processElement(element) {
        if (typeof element == "string") {
            return element;
        }
        if (element.type == "paragraph") {
            const paragraph = element;
            const data = {
                element: "p",
                children: parseContent(paragraph.children),
            };
            return data;
        }
        if (element.type == "list") {
            const list = element;
            const tag = list.ordered ? "ol" : "ul";
            const data = {
                element: tag,
                children: parseContent(list.items)
            };
            return data;
        }
        if (element.type == "styledText") {
            const styledText = element;
            const tag = styledText.link ? "a" : "span";
            const data = Object.assign({ element: tag, children: [styledText.text], style: styledText.css }, (styledText.link && { attrs: { href: styledText.link } }));
            return data;
        }
        if (element.type == "table") {
            const component = processTable_1.default(config.components, element, parseContent);
            if ("error" in component) {
                console.error(component.message);
                return false;
            }
            return component;
        }
        if (element.type == "footnoteReference") {
            const { footnoteNumber, footnoteId } = element;
            footnoteMap[footnoteId] = footnoteNumber;
            return {
                component: "FootnoteReference",
                props: {
                    footnoteNumber: footnoteNumber
                }
            };
        }
        return false;
    }
    const parseContent = (elements) => {
        if (Array.isArray(elements)) {
            return elements.map(processElement).filter(Boolean);
        }
    };
    if (doc) {
        const processedBody = parseContent(doc.body);
        let processedFootnotes;
        if (doc.footnotes) {
            const footnoteContent = (footnoteId) => {
                const footnote = doc.footnotes[footnoteId];
                if (!footnote)
                    return false;
                return parseContent(footnote);
            };
            const footnoteEntries = Object.entries(footnoteMap).map(([footnoteId, footnoteNumber]) => ([footnoteNumber, footnoteContent(footnoteId)]));
            processedFootnotes = Object.fromEntries(footnoteEntries);
        }
        return Object.assign({ body: processedBody, title: doc.title, readAt: doc.readAt }, (processedFootnotes && { footnotes: processedFootnotes }));
    }
}
exports.componentsFromDoc = componentsFromDoc;
//# sourceMappingURL=index.js.map