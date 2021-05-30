// import { getDoc } from '../src';
import { getFilesInFolder } from "../src/connect";
import info from "../docsconfig.json";

test('works', async () => {
  await getFilesInFolder(info, "1N6LOELmhyojRJgaqP1DgfP7s0yJYmCqU");
  // await getDoc(info, "1GCRUUrFSsQhC20QoFi9WNbfY3utQmVHMvSLlZ551CCs");
})

