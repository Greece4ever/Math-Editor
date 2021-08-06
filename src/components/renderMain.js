import katex from "katex";
import convertFraction, { insert_at, splitAtRange } from "./parsing";
import {Latex, line_repl, repl, m, fnd, removeAtRange, line_replace, findInside} from './replace'

function replaceMath(str, ptrn="$$") {
    let ind = findInside(str, ptrn); // Find where it starts and ends 
    let sub_str;
    while (ind[0] != -1) {
      str= ind[2]; // End
      sub_str = removeAtRange(str, ind[0], ind[1]); // math string
      str = splitAtRange(str, ind[0], ind[1]); // rest of the string
      Latex.forEach(symbol => {
        sub_str = sub_str.replaceAll(symbol[0], symbol[1])
      });
      
      try {
        sub_str = convertFraction(sub_str);
      } catch(e) {};
  
      let html = katex.renderToString(sub_str, {throwOnError: false});
  
      // html = `<div class="center">${html}</div>`
  
      str = insert_at(str, html, ind[0]);
      ind = findInside(str, ptrn);
    }
    return str;
  }
  
  
function replaceMathCenter(str, ptrn="$$") {
    let ind = findInside(str, ptrn); // Find where it starts and ends 
    let sub_str;
    while (ind[0] != -1) {
      str= ind[2]; // End
      sub_str = removeAtRange(str, ind[0], ind[1]); // math string
      str = splitAtRange(str, ind[0], ind[1]); // rest of the string
      Latex.forEach(symbol => {
        sub_str = sub_str.replaceAll(symbol[0], symbol[1])
      });
      
      try {
        sub_str = convertFraction(sub_str);
      } catch(e) {};
  
      let html = katex.renderToString(sub_str, {throwOnError: false});
  
      html = `<div class="center">${html}</div>`
  
      str = insert_at(str, html, ind[0]);
      ind = findInside(str, ptrn);
    }
    return str;
  }
  
export function renderMarkdown(val)
  {
      // ([A-Za-z]|[^\x00-\x7F])(\d)
    line_repl.forEach(i => {
      val = line_replace( /*"\n" +*/ val, "\n" +i[0], "\n", i[1])

      // val = val.replace("\n", "");      
    })
  
    repl.forEach(i => {
      val = fnd(val, i[0], i[1]);
    })

    val = replaceMathCenter(val, "$$");
    val = replaceMath(val, "@@");
  
    return val;
  }
  