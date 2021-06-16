import componentFromTable from "./componentFromTable";
export function componentsFromDoc(config, doc) {
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
        return elements.map(processElement).filter(Boolean);
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
//# sourceMappingURL=index.js.map