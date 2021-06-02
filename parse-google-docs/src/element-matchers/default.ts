import {elementMatcher} from "./types";
import {docs_v1} from "googleapis";

type paragraph = {
  paragraph: {
    simple?: true,
    children: Array<string | object>
  }
}

const paragraphMatcher: elementMatcher = {
  matchProperty: "paragraph",
  resolve (object, parseChild): paragraph | false {
    const paragraph = object as docs_v1.Schema$Paragraph;
    if (paragraph.elements) {
      const children: Array<string | object> = [];
      paragraph.elements.map(parseChild).forEach(el => {
        if (!el) return;

        const lastAdded = children.length && children[children.length - 1];
        if (typeof lastAdded == "string" && typeof el == "string") {
          children[children.length - 1] += el;
          return;
        }

        children.push(el);
      })
      return {
        paragraph: {
          children,
          ...(children.length == 1 && {simple: true})
        }
      }
    }
    return false;
  }
}



const htmlReplacements: {[matchProperty: string]: (text: string, value: object) => string} = {
  underline: text => `<u>${text}</u>`,
  italic: text => `<i>${text}</i>`,
  bold: text => `<b>${text}</b>`,
  strikethrough: text => `<s>${text}</s>`,
  link: (text, linkObj ) => `<a href="${(linkObj as docs_v1.Schema$Link).url}">${text}</a>`
}

const textRunMatcher: elementMatcher = {
  matchProperty: "textRun",
  resolve (object, parseChild) {
    const text = object as docs_v1.Schema$TextRun;
    if (!text.content) return false;

    const textStyle = text.textStyle;

    let html = text.content;
    if (!textStyle) return html;

    // const colors: {foreground?: string, background?: string} = {};
    // const font: {family?: string, weight?: number, size?: string} = {};
    const css: {
      color?: string,
      "background-color"?: string,
      "font-family"?: string,
      "font-weight"?: number,
      "font-size"?: string
    } = {};

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
      const { fontFamily, weight} = textStyle.weightedFontFamily;
      if (fontFamily) {
        css["font-family"] = fontFamily;
        if (weight) css["font-weight"] = weight;
      }
    }

    if (textStyle?.fontSize) {
      css["font-size"] = textStyle.fontSize.magnitude! + textStyle.fontSize.unit!;
    }


    Object.keys(htmlReplacements).forEach(key => {
      if (key in textStyle) {
        // @ts-ignore
        html = htmlReplacements[key](html, textStyle[key]);
      }
    })

    const hasCSS = Object.keys(css).length;
    if (!hasCSS) return html;
    return {
      styledText: {
        html,
        css
      }
    }
  }
}

const tableMatcher: elementMatcher = {
  matchProperty: "table",
  resolve (object, parseChild) {
    const table = object as docs_v1.Schema$Table;
    if (!table.tableRows?.length) return false;
    const rows = table.tableRows.map (row => row.tableCells!.map(cell => {
        const content = cell.content!.map(c => {
          const element = parseChild(c);
          if (typeof element == "object" && "paragraph" in element) {
            const paragraph = (element as paragraph).paragraph;
            if (paragraph.simple) {
              return paragraph.children[0];
            }
          }
          return element;
        })

        if (content.length == 1) {
          return content[0];
        }
        return content;
      })
    );
    return {
      table: {
        rows
      }
    };
    return false;
  }
}

export default [paragraphMatcher, tableMatcher, textRunMatcher];
