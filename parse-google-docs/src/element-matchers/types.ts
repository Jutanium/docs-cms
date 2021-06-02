import {parseContent} from "../parse";

export type elementMatcher = {
  matchProperty: string,
  resolve: (object: object, parseChild: typeof parseContent) => object | string | false
}

export type elementMatchers = {
  [matchProperty: string]: elementMatcher
}


