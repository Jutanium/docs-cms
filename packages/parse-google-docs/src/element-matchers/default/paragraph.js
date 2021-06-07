export const paragraphMatcher = {
    matchProperty: "paragraph",
    resolve(object, parseChild) {
        const paragraph = object;
        if (paragraph.elements) {
            const children = [];
            paragraph.elements.map(parseChild).forEach(el => {
                if (!el)
                    return;
                if (el == "\n" || el?.html == "\n")
                    return;
                const lastAdded = children.length && children[children.length - 1];
                if (typeof lastAdded == "string" && typeof el == "string") {
                    children[children.length - 1] += el;
                    return;
                }
                children.push(el);
            });
            if (children.length == 0)
                return false;
            const isSimple = children.length == 1 && typeof children[0] == "string";
            const properties = {
                children,
                ...(isSimple && { simple: true })
            };
            if (paragraph.paragraphStyle?.namedStyleType?.includes("HEADING")) {
                const size = Number(paragraph.paragraphStyle.namedStyleType.split('_')[1]);
                return {
                    type: "header",
                    size,
                    ...properties
                };
            }
            return {
                type: "paragraph",
                ...properties
            };
        }
        return false;
    }
};
//# sourceMappingURL=paragraph.js.map