import {elementMatcher} from "../types";
import {docs_v1} from "@googleapis/docs";

const htmlReplacements: { [matchProperty: string]: (text: string, value: object) => string } = {
  underline: text => `<u>${text}</u>`,
  italic: text => `<i>${text}</i>`,
  bold: text => `<b>${text}</b>`,
  strikethrough: text => `<s>${text}</s>`,
  link: (text, linkObj) => `<a href="${(linkObj as docs_v1.Schema$Link).url}">${text}</a>`
}

type textCSS = {
  color?: string,
  "background-color"?: string,
  "font-family"?: string,
  "font-weight"?: number,
  "font-size"?: string
}

export type styledText = {
  type: "styledText"
  html: string,
  css: textCSS
}

function processTextStyle (textStyle: docs_v1.Schema$TextStyle): textCSS {
  const css: textCSS = {};

  const convertColor = (color: docs_v1.Schema$OptionalColor) => {
    if (!color.color) {
      //"Fully transparent color". Not sure how this happens.
      return "rgb(255,255,255,0)";
    }
    const rgb = color.color!.rgbColor!;

    const toPercentage = (color: number | null | undefined) => {
      const decimal = color || 0;
      return decimal * 100 + '%';
    }

    return `rgb(${toPercentage(rgb.red)}, ${toPercentage(rgb.green)}, ${toPercentage(rgb.blue)})`;
  }
  if (textStyle?.foregroundColor) {
    css.color = convertColor(textStyle.foregroundColor);
  }

  if (textStyle?.backgroundColor) {
    css["background-color"] = convertColor(textStyle.backgroundColor);
  }

  if (textStyle?.weightedFontFamily) {
    const {fontFamily, weight} = textStyle.weightedFontFamily;
    if (fontFamily) {
      css["font-family"] = fontFamily;
      if (weight) css["font-weight"] = weight;
    }
  }

  if (textStyle?.fontSize) {
    css["font-size"] = textStyle.fontSize.magnitude! + textStyle.fontSize.unit!;
  }

  return css;
}

export const textRunMatcher: elementMatcher = {
  matchProperty: "textRun",
  resolve(object, parseChild): string | styledText | false {
    const text = object as docs_v1.Schema$TextRun;
    if (!text.content) return false;

    const textStyle = text.textStyle;

    let html = text.content;
    if (!textStyle) return html;

    Object.keys(htmlReplacements).forEach(key => {
      if (key in textStyle) {
        // @ts-ignore
        html = htmlReplacements[key](html, textStyle[key]);
      }
    })

    const css = processTextStyle(textStyle);
    const hasCSS = Object.keys(css).length;

    if (!hasCSS) return html;
    return {
      type: "styledText",
      html,
      css
    }
  }
}