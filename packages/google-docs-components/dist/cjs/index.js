"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.componentsFromDoc = void 0;
const componentFromTable_1 = __importDefault(require("./componentFromTable"));
function componentsFromDoc(config, doc) {
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
        if (element.type == "styledText") {
            const styledText = element;
            const data = {
                element: "span",
                children: [styledText.html],
                style: styledText.css,
            };
            return data;
        }
        if (element.type == "table") {
            const component = componentFromTable_1.default(config.components, element, parseContent);
            if ("error" in component) {
                console.error(component.message);
                return false;
            }
            return component;
        }
        return false;
    }
    const parseContent = (elements) => {
        return elements.map(processElement).filter(Boolean);
    };
    if (doc) {
        const processed = parseContent(doc.body);
        return processed;
    }
}
exports.componentsFromDoc = componentsFromDoc;
//# sourceMappingURL=index.js.map