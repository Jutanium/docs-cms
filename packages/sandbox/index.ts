

import testFileOutput from "./testFileOutput.json"

import { getDoc, parseDoc, document } from "google-docs-parser"
import { componentsFromDoc } from "google-docs-components";
import * as fs from "fs";

const document = parseDoc(testFileOutput);
componentsFromDoc(document);

fs.writeFile("document.json", JSON.stringify(document), () => console.log);

