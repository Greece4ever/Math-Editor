import React, { useState } from "react";
import Parser from "html-react-parser";
import katex from "katex";
import { fireEvent } from "@testing-library/react";

function insert_at(str, insrt, pos) {
  return str.slice(0, pos) + insrt + str.slice(pos, str.length);
}

function m(str, times) {
  let string = "";
  for (let i=0; i < times; i++) {
    string += str;
  }
  return string;
}

function hdrs() {
  let arr = [];
  for (let i=1; i <= 4; i++) {
    arr.push([m("#", i), `h${i}`]);
  }
  arr.reverse();
  return arr;
}


function fnd(str, pttr, tag) {
  let closing = false;
  while (str.indexOf(pttr) != -1) {
    str = str.replace(pttr, `<${closing ? "/" : ""}${tag}>`);
    closing = !closing;
  }
  return str;
}

function replace_after(str, pttr, rpl, after) {
  return str.slice(0, after) + str.slice(after).replace(pttr, rpl)
}

function removeAtRange(str, x, y) {
  return str.substring(x, y);
}

function splitAtRange(str, x, y) {
  return str.substring(0, x) + str.substring(y, str.length);
}

function line_replace(str, pttr0, pttrn1, rpl) {
  let i = str.indexOf(pttr0);
  while (i != -1) {
    str = str.replace(pttr0, `<${rpl}>`);
    str =  replace_after(str, pttrn1, `</${rpl}>\n`, i);
    i = str.indexOf(pttr0);
  }
  return str;
}

function findInside(str, match) {
  let i = str.indexOf(match); str = str.replace(match, ' ');
  let j = str.indexOf(match); str = str.replace(match, ' ');
  return [i, j == -1 ? str.length : j, str];
}

let Latex = [
  ['>=', "\\ge"],
  ["<=>", " \\iff "],
  ['<=', "\\le"],
  ['=>', "\\implies"],
  ["+-", "\\pm"],
  ["sqrt", "\\sqrt"],
  [/x(\d)/g, "x_$1"]
]


function replaceMath(str, ptrn="$$") {
  let ind = findInside(str, ptrn); // Find where it starts and ends 
  let sub_str;
  while (ind[0] != -1) {
    str= ind[2]; // End
    sub_str = removeAtRange(str, ind[0], ind[1]); // math string
    str = splitAtRange(str, ind[0], ind[1]); // rest of the string
    sub_str = sub_str.replaceAll("!=", "\\neq");
    Latex.forEach(symbol => {
      sub_str = sub_str.replaceAll(symbol[0], symbol[1])
    });

    let html = katex.renderToString(sub_str, {throwOnError: false});
    str = insert_at(str, html, ind[0]);
    ind = findInside(str, ptrn);
  }
  return str;
}


function App() {
  const [value, setValue] = useState("");  
  const repl = [
    ["**", "b"],
    ["*"],
    ["\n\n", "p"],
  ]

  const line_repl = [
    ...hdrs(),
    ['-', "ul"]

  ]


  return (
    <div className="App">
      <div>

      <textarea
      style={{
        "width" : "50%",
        height : "500px",
        fontSize: "13px",
        float: "left"
      }}
      
      onChange={(e) => {
        let val = e.currentTarget.value;

        // ([A-Za-z]|[^\x00-\x7F])(\d)
        line_repl.forEach(i => {
          val = line_replace(val, "\n" +i[0], "\n", i[1])
        })

        repl.forEach(i => {
          val = fnd(val, i[0], i[1]);
        })

        val = replaceMath(val);
        setValue(val);
      }}

      onKeyDown={(e) => {
          let target = e.currentTarget;
          let value = target.value;
          switch (e.key.toLocaleLowerCase()) {
            case "tab":
              e.preventDefault();
              target.value = insert_at(target.value, "    ", target.selectionStart)
              console.log(target.value);
              break;
            case "shift":
              break;
          }

      }}></textarea>
      
      <div style={{
        width: "48%",
        background: "white",
        float: "right",
        marginTop: " 10px"
      }}>
      
          {Parser(value)}
      </div>

      </div>
    </div>
  );
}

export default App;
