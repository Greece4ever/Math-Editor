import React, { useEffect, useState } from "react";
import Parser from "html-react-parser";
import katex from "katex";
import convertFraction, { insert_at, splitAtRange } from "./components/parsing";
import html2canvas from 'html2canvas';


import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FunctionsIcon from '@material-ui/icons/Functions';

import "./App.css";

import Fab from '@material-ui/core/Fab';
import GitHubIcon from '@material-ui/icons/GitHub';


const useStyles = makeStyles({
  root: {
    background: '#3b3939',
    border: 0,
    
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px',
  },
});



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
  ["!=", "\\neq"],
  [/([A-Za-z]|[^\x00-\x7F])(\d)/g, "$1_$2"],

  // [/x(\d)/g, "x_$1"]
]

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



function App() {
  const [value, setValue] = useState("");  
  const repl = [
    ["**", "b"],
    ["*_", "i"],
    ["\n\n", "p"],
    ["```", "pre"]
  ]


  const line_repl = [
    ...hdrs(),
    ['-', "ul"]

  ]
  
  const [buffer, setBuffer] = useState("");

  const classes = useStyles();


  return (
    <div className="App">
      <div>

      <div style={{
        width: "100%",
        height: "400px",
        backgroundColor: "#393838",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative"
      
      }}>

        <div>
          <div style={{
            width : "98px",
            height: "98px",
            backgroundColor: "white",
            borderRadius: "500px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
    
          }}>

          <FunctionsIcon style={{
            width:  "64px",
            height: "64px",
            color: "rgb(57, 56, 56)"

    

          }}/>  
            
          </div>          
        </div>

        <h2 style={{"marginLeft" : "30px", color: "aliceblue", fontFamily: "math2", }}>
          Math Editor
        </h2>


        <Fab style={{position: "absolute", marginRight: "10px", marginBottom: "10px", right: 0, bottom: 0}} color="inherit" aria-label="add">
          <GitHubIcon />
        </Fab>


      </div>



      <textarea
      style={{
        "width" : "50%",
        height : "500px",
        fontSize: "13px",
        resize: "vertical",
        float: "left",
        border: "1px solid red"
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

        val = replaceMathCenter(val, "$$");
        val = replaceMath(val, "@@");
        // val
        //val = `<div class="center">${val}</div>`
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
        marginTop: " 10px",
        fontFamily: "math"
        
      }}
      dangerouslySetInnerHTML={{__html: value}}
      >
          {/* {Parser(value)} */}
      </div>
      
      </div>

    </div>
  );
}

export default App;
