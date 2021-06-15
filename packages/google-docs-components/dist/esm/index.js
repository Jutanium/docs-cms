import componentFromTable from "./componentFromTable";
export function componentsFromDoc(config, doc) {
    function processElement(element) {
        if (typeof element == "string") {
            return element;
        }
        if (element.type == "table") {
            const component = componentFromTable(config.components, element, parseContent);
            console.log(component);
            return component;
        }
        return element;
    }
    const parseContent = (elements) => {
        return elements.map(processElement);
    };
    if (doc) {
        console.log("hi from here");
        const processed = parseContent(doc.body);
    }
}
//# sourceMappingURL=index.js.map