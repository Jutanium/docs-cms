import {paragraphMatcher, paragraph} from "./paragraph";
import {textRunMatcher, styledText} from "./text";
import {tableMatcher, table} from "./table";
import {footnoteReferenceMatcher, footnoteReference} from "./footnote";

export const elementMatchers = [paragraphMatcher, tableMatcher, textRunMatcher, footnoteReferenceMatcher];
export type { paragraph, styledText, table, footnoteReference }