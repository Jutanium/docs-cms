import componentFromTable from "./componentFromTable";
export function componentsFromDoc(config, doc) {
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
            const component = componentFromTable(config.components, element, parseContent);
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
//# sourceMappingURL=index.js.map