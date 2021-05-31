// import { getDoc } from '../src';
import { getFilesInFolder, getDoc} from "../src/connect";
import info from "../docsconfig.json";
import {docs_v1, drive_v3} from "googleapis";

const testFolder = "1N6LOELmhyojRJgaqP1DgfP7s0yJYmCqU";
const testFile = "13CmnM9JAJJoDsVjPR79og0JTORlUISyAzhxo1K-UeTU"

describe("getFilesInFolder", () => {

  let returnedFiles: Array<drive_v3.Schema$File> | undefined;
  beforeAll(async () => returnedFiles = await getFilesInFolder(info, testFolder));

  test('returns an array of files', async () => {
    const isArray = Array.isArray(returnedFiles);
    expect(isArray).toBeTruthy();
    if (isArray) {
      (returnedFiles as Array<drive_v3.Schema$File>).forEach(file => expect(file).toEqual(expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String)
      })));
    }
  })

})

describe("getDoc", () => {
  let returnedFile: docs_v1.Schema$Document | undefined;

  beforeAll(async () => returnedFile = await getDoc(info, testFile));
  test('returns a document', () => {
    expect(returnedFile).toBeTruthy();
    expect(returnedFile).toEqual(expect.objectContaining({
      title: expect.any(String),
      documentId: expect.any(String),
      body: expect.objectContaining({ content: expect.any(Array)})
    }))
  })




})