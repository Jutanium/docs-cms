import {docs_v1} from "@googleapis/docs";
import Schema$Paragraph = docs_v1.Schema$Paragraph;

let listProperties: {
  [listId: string]: docs_v1.Schema$ListProperties
} = {}

export type rawList = {
  items: Array<{paragraph: docs_v1.Schema$Paragraph}>,
  listProperties: docs_v1.Schema$ListProperties
}

export function registerLists(document: docs_v1.Schema$Document) {
  if (document.lists) {
    for (const id in document.lists) {
      listProperties[id] = document.lists[id].listProperties;
    }
  }
}

export function extractLists(contentArray: Array<object>) {
  const isListEl = (el) => el?.paragraph?.bullet;

  let newArr = [];
  let currList: { listId?: string, items?: Array<{paragraph: Schema$Paragraph}> } = {};

  const pushCurrList = () => {
    const list: { list: rawList } = {
      list: {
        items: currList.items!,
        listProperties: listProperties[currList.listId]
      }
    }
    newArr.push(list);
  }

  for (let el of contentArray) {
    if (isListEl(el)) {
      const listEl = (el as {paragraph: Schema$Paragraph});
      let currId = listEl.paragraph.bullet.listId;
      if (!currList.listId) {
        currList = {
          listId: currId,
          items: [listEl]
        }
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
      }
      continue;
    }
    if (currList.listId) {
      pushCurrList();
      currList = {}
    }
    newArr.push(el);
  }

  if (currList.listId) {
    pushCurrList();
  }

  return newArr;
}