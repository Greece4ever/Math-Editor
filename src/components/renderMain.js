import katex from "katex";
import convertFraction, { insert_at, splitAtRange } from "./parsing";
import {Latex, line_repl, repl, m, fnd, removeAtRange, __line_replace, findLink, findInside, just_repl} from './replace'

// convert math string e.g `x/5` to latex `\frac{x}{5}`
export function convertLatex(sub_str)
{
  Latex.forEach(symbol => {
    sub_str = sub_str.replaceAll(symbol[0], symbol[1] + " ")
  });
  
  try {
    sub_str = convertFraction(sub_str);
  } catch(e) {};

  return katex.renderToString(sub_str, {throwOnError: false});
};

export function renderMarkdown(val)
  {
    line_repl.forEach(i => {
      val = __line_replace(val, i[0], i[1], i[2]);
    })


    just_repl.forEach(i => {
      
      val = val.replaceAll(i[0], i[1]);
    })

    
    repl.forEach(i => {
      val = fnd(val, i[0], i[1]);
    })

    // val = convertLinks(val);
  
    return val;
  }


export function findAllMath(str, ptrn="$$", className="math", tag="span") {
  let ind = findInside(str, ptrn); // Find where it starts and ends 
  let sub_str;

  let math_strings = [];

  while (ind[0] != -1) {
    str= ind[2]; // End
    sub_str = removeAtRange(str, ind[0], ind[1]); // math string
    str = splitAtRange(str, ind[0], ind[1]); // rest of the string

    math_strings.push(sub_str);

    let html = `<${tag} class="${className}"></${tag}>`


    str = insert_at(str, html, ind[0]);
    ind = findInside(str, ptrn);
  }

  return [str, math_strings];
}

// export function addLineNumbers(codeString)
// {
//   return "<span>" + codeString.split("\n").join("</span><span>") + "</span>";
// }





