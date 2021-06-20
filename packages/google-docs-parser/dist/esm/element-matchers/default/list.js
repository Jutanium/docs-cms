export const listMatcher = {
    matchProperty: "list",
    resolve(object, parseChildren) {
        const rawList = object;
        const makeList = (items, depth = 0) => {
            const ordered = !!rawList.listProperties.nestingLevels[depth].glyphType;
            const children = [];
            let i = 0;
            while (i < items.length) {
                const curr = items[i];
                const currDepth = curr.paragraph.bullet.nestingLevel || 0;
                if (currDepth > depth) {
                    let sublistItems = [];
                    while (i < items.length && items[i].paragraph.bullet.nestingLevel >= currDepth) {
                        sublistItems.push(items[i]);
                        i++;
                    }
                    const sublist = makeList(sublistItems, currDepth);
                    children.push(sublist);
                    continue;
                }
                children.push(curr);
                i++;
            }
            return {
                type: "list",
                ordered,
                items: children
            };
        };
        return makeList(rawList.items);
    }
};
//# sourceMappingURL=list.js.map