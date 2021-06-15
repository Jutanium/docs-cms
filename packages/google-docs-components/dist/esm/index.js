import componentFromTable from "./componentFromTable";
export function componentsFromDoc(config, doc) {
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
            const component = componentFromTable(config.components, element, parseContent);
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
//# sourceMappingURL=index.js.map