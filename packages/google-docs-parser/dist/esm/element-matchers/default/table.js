export const tableMatcher = {
    matchProperty: "table",
    resolve(object, parseChild) {
        var _a;
        const table = object;
        if (!((_a = table.tableRows) === null || _a === void 0 ? void 0 : _a.length))
            return false;
        const cells = [];
        const rows = Array.from(Array(table.rows), () => Array(table.columns).fill(-1));
        table.tableRows.forEach((tableRow, y) => {
            tableRow.tableCells.forEach((cell, x) => {
                const content = cell.content.map(c => {
                    const element = parseChild(c);
                    if (typeof element == "object" && "paragraph" in element) {
                        const paragraph = element;
                        if (paragraph.simple) {
                            return paragraph.children[0];
                        }
                    }
                    return element;
                }).filter(el => el);
                if (content.length == 0)
                    return;
                const { rowSpan, columnSpan } = cell.tableCellStyle;
                for (let i = 0; i < rowSpan; i++) {
                    for (let j = 0; j < columnSpan; j++) {
                        rows[y + i][x + j] = cells.length;
                    }
                }
                cells.push(content);
            });
        });
        return {
            type: "table",
            rows,
            cells
        };
        return false;
    }
};
//# sourceMappingURL=table.js.map