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
            return;
        }
        if (element.type == "table") {
            return componentFromTable_1.default(config.components, element);
        }
    }
    if (doc) {
        console.log("hi from here");
        const processed = doc.body.map(processElement);
    }
}
exports.componentsFromDoc = componentsFromDoc;
//# sourceMappingURL=index.js.map