import React, { useEffect, useState, useRef } from "react";
import katex from "katex";
import convertFraction, { insert_at, splitAtRange } from "./components/parsing";
import html2canvas from 'html2canvas';


import { makeStyles } from '@material-ui/core/styles';
import FunctionsIcon from '@material-ui/icons/Functions';

import "./App.css";

import useInterval from "./components/hooks";

import Fab from '@material-ui/core/Fab';

import SaveAltIcon from '@material-ui/icons/SaveAlt';
import Grid from '@material-ui/core/Grid';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';


import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-markdown";
import "ace-builds/src-noconflict/theme-monokai";

import "ace-builds/src-noconflict/theme-kuroir";
import "ace-builds/src-noconflict/theme-tomorrow";

import "ace-builds/src-noconflict/ext-language_tools"


import SaveIcon from '@material-ui/icons/Save';

import Tooltip from '@material-ui/core/Tooltip';
import ImageIcon from '@material-ui/icons/Image';

const useStyles = makeStyles(theme => ({
  root: {
    background: '#3b3939',
    border: 0,
    
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px',
  },

  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },

}));



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
  ["<-", "\\leftarrow"],
  ["->", "\\rightarrow"],
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
  const [textValue, setTextValue] = useState("");
  const [value, setValue]   = useState("");  
  const [value2, setValue2] = useState("");
  const repl = [
    ["**", "b", "Bold"],
    ["*_", "i", "Italic"],
    ["\n\n", "p", ""],
    ["```", "pre", "Code"]
  ]


  const line_repl = [
    ...hdrs(),
    ['-', "ul"]

  ]

  useInterval(() => {
    localStorage.setItem("html", textValue)
  }, 15 * 1000);
  
  const [buffer, setBuffer] = useState("");

  const classes = useStyles();

  const [hidden, setHidden] = useState(false);

  const [animation, setAnimation] = useState("spin 8s linear infinite");

  // Load previous text from memory
  useEffect(() => {
    let val = localStorage.getItem("html");
    if (!val)
      return;

    setTextValue(val);

    line_repl.forEach(i => {
      val = line_replace(val, "\n" +i[0], "\n", i[1])
    })

    repl.forEach(i => {
      val = fnd(val, i[0], i[1]);
    })

    val = replaceMathCenter(val, "$$");
    val = replaceMath(val, "@@");

    setValue(val);

  }, [])


  // Print End Listener
  useEffect(() => {
    const onPrintEnd = (event) => {
      setHidden(false);
    }
      
    window.addEventListener("afterprint", onPrintEnd);
    
    return () => {
      window.removeEventListener('afterprint', onPrintEnd);
    }
  }, []);

  const main_color = "rgb(57, 68, 70)";

  // Print when hit PRINT .PDF
  useEffect(() => {
    if (hidden) {
      console.log(document.getElementById("NOTICEME").getAttribute("val"));
      if (document.getElementById("NOTICEME").getAttribute("val") == "1")
      {
        html2canvas(document.getElementById("NOTICEME") ).then(canvas => {
          var link = document.createElement("a");
          link.setAttribute('download', `math${Math.random().toString().split(".")[1]}.png`);
          link.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
          link.click();     
          setHidden(false);    
        })
      }
      else {
        window.print();
      }
    }
  }, [hidden])



  // Editor
  const _grid = useRef();
  const [_height, set_height] = useState(0);

  useEffect(() => {
    set_height(window.innerHeight - _grid.current.offsetTop);
  }, [_grid])


  const _render = useRef();
  const [_rendered, set_rendered] = useState(0);

  useEffect(() => {
    set_rendered(window.innerHeight - _render.current.offsetTop);
  }, [_render])

  useEffect(() => {
    const onResize = (event) => {
      set_height(window.innerHeight - _grid.current.offsetTop);
      set_rendered(window.innerHeight - _render.current.offsetTop);
    }
      
    window.addEventListener("resize", onResize);
    
    return () => {
      window.removeEventListener('resize', onResize);
    }
  }, [])




  const handleChange = e => {
    let val = e;
    setTextValue(val);

    // ([A-Za-z]|[^\x00-\x7F])(\d)
    line_repl.forEach(i => {
      val = line_replace(val, "\n" +i[0], "\n", i[1])
    })

    repl.forEach(i => {
      val = fnd(val, i[0], i[1]);
    })

    val = replaceMathCenter(val, "$$");
    val = replaceMath(val, "@@");

    setValue(val);
  }

  const savePDF = () => {
    document.getElementById("NOTICEME").setAttribute("val", "0")
    setHidden(true);
    setValue2(value);
    localStorage.setItem("html", textValue);
  }


  const savePNG = () => {
    document.getElementById("NOTICEME").setAttribute("val", "1");
    setHidden(true);
    setValue2(value);

  }


  return (
    <div className="App">

      <div style={{display: hidden ? "none" : ""}}>

      <div style={{
        width: "100%",
        height: "10px",
        backgroundColor: "rgb(57, 68, 70)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative"
      
      }}
      
      
      onWheel={() => console.log("scroll")}>


      </div>

      <div style={{
      position: "absolute",
      right: 0,
      bottom: 0,
      display: "grid"
      }}>
        <Fab onClick={() => savePDF()} style={{marginBottom: "10px", marginRight: "10px"}} color="secondary" aria-label="add">
          <PictureAsPdfIcon />    
        </Fab>

        <Fab onClick={() => savePNG()} style={{marginBottom: "10px", marginRight: "10px"}} color="primary" aria-label="add">
          <ImageIcon />
        </Fab>
      </div>




      <Grid style={{ }} container spacing={3}>
        <Grid ref={_grid} style={{borderRight: `10px solid ${main_color}`, paddingBottom: 0, paddingRight: 0, height: _height}} item xs={6}>
          <AceEditor  
          value={textValue}
          style={{width: "100%"}}

          onChange={e => handleChange(e)}
          
          fontSize={15}
          height={_height}
          placeholder={`Start typing some math. Syntax rules can be found in https://github.com/Greece4ever/Math-Editor`}
          mode="markdown"
          theme="monokai"
          name="blah2" />


        </Grid>

        <Grid style={{height: _rendered, paddingBottom: 0, borderLeft: `10px solid ${main_color}`}} ref={_render} item xs={6}>
          <div id="peos" style={{
            width: "100%",
            background: "white",
            float: "right",

            marginTop: "10px",
            fontFamily: "math",
            height: "calc(100% - 10px)",

            overflow: "auto"
          }}

          dangerouslySetInnerHTML={{__html: value}}></div>
        </Grid>
      </Grid>
      </div>

        <div val="0" id="NOTICEME" style={{display: hidden ? "block" : "none", fontFamily: "math", margin: "10px", minHeight: window.innerHeight}} dangerouslySetInnerHTML={{__html: value2}}></div>
    </div>
  );
}

export default App;
