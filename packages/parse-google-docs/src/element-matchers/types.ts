import {parseContent} from "../parse";

export type element = {
  type: string
} | string;

export type elementMatcher = {
  matchProperty: string,
  resolve: (object: object, parseChild: typeof parseContent) => element | false
}
