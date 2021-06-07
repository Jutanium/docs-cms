// import { getDoc } from '../src';
import { getFilesInFolder, getDoc } from "../src/connect";
import info from "../docsconfig.json";
const testFolder = "1N6LOELmhyojRJgaqP1DgfP7s0yJYmCqU";
const testFile = "13CmnM9JAJJoDsVjPR79og0JTORlUISyAzhxo1K-UeTU";
let returnedFile;
beforeAll(async () => returnedFile = await getDoc(info, testFile));
let returnedFiles;
beforeAll(async () => returnedFiles = await getFilesInFolder(info, testFolder));
describe("getFilesInFolder", () => {
    test('returns an array of files', async () => {
        const isArray = Array.isArray(returnedFiles);
        expect(isArray).toBeTruthy();
        if (isArray) {
            returnedFiles.forEach(file => expect(file).toEqual(expect.objectContaining({
                id: expect.any(String),
                name: expect.any(String)
            })));
        }
    });
});
describe("getDoc", () => {
    test('returns a document', () => {
        expect(returnedFile).toBeTruthy();
        expect(returnedFile).toEqual(expect.objectContaining({
            title: expect.any(String),
            documentId: expect.any(String),
            body: expect.objectContaining({ content: expect.any(Array) })
        }));
    });
});
//# sourceMappingURL=connect.test.js.map