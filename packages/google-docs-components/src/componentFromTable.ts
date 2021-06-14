import { ComponentDef } from "./types";

import {elementTypes} from "google-docs-parser"

type Table = elementTypes.table;

export default function (components: Array<ComponentDef>, table: Table) {
  console.log("hi from table");
}