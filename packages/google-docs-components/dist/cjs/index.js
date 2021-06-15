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
                tag: "p",
                children: parseContent(paragraph.children),
            };
        }
        if (element.type == "table") {
            const component = componentFromTable_1.default(config.components, element, parseContent);
            console.dir(component);
            if ("error" in component) {
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
        console.log("hi from here");
        const processed = parseContent(doc.body);
    }
}
exports.componentsFromDoc = componentsFromDoc;
//# sourceMappingURL=index.js.map