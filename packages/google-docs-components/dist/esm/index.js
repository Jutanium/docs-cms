import componentFromTable from "./componentFromTable";
export function componentsFromDoc(config, doc) {
    function processElement(element) {
        if (typeof element == "string") {
            return;
        }
        if (element.type == "table") {
            return componentFromTable(config.components, element);
        }
    }
    if (doc) {
        console.log("hi from here");
        const processed = doc.body.map(processElement);
    }
}
//# sourceMappingURL=index.js.map