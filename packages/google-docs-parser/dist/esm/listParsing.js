let listProperties = {};
export function registerLists(document) {
    if (document.lists) {
        for (const id in document.lists) {
            listProperties[id] = document.lists[id].listProperties;
        }
    }
}
export function extractLists(contentArray) {
    const isListEl = (el) => { var _a; return (_a = el === null || el === void 0 ? void 0 : el.paragraph) === null || _a === void 0 ? void 0 : _a.bullet; };
    let newArr = [];
    let currList = {};
    const pushCurrList = () => {
        const list = {
            list: {
                items: currList.items,
                listProperties: listProperties[currList.listId]
            }
        };
        newArr.push(list);
    };
    for (let el of contentArray) {
        if (isListEl(el)) {
            const listEl = el;
            let currId = listEl.paragraph.bullet.listId;
            if (!currList.listId) {
                currList = {
                    listId: currId,
                    items: [listEl]
                };
                continue;
            }
            if (currList.listId == currId) {
                currList.items.push(listEl);
                continue;
            }
            pushCurrList();
            currList = {
                listId: currId,
                items: [listEl]
            };
            continue;
        }
        if (currList.listId) {
            pushCurrList();
            currList = {};
        }
        newArr.push(el);
    }
    if (currList.listId) {
        pushCurrList();
    }
    return newArr;
}
//# sourceMappingURL=listParsing.js.map