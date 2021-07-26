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
import Tab from '@material-ui/core/Tab';

import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

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


  // Print when hit PRINT .PDF
  useEffect(() => {
    if (hidden) {
      window.print();
    }
  }, [hidden])

  const [val, setVal] = useState(0);



  return (
    <div className="App">
      <div style={{display: hidden ? "none" : ""}}>

      <div style={{
        width: "100%",
        height: "200px",
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


        <Fab 
        onClick={() => {
          html2canvas(document.getElementById("peos").parentElement ).then(canvas => {
            var link = document.createElement("a");
            link.setAttribute('download', `math${Math.random().toString().split(".")[1]}.png`);
            link.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
            link.click();          
          })
        }} 
        
        style={{position: "absolute", marginRight: "10px", marginBottom: "10px", right: 0, bottom: 0}} variant="extended" color="inherit" aria-label="add">
          <SaveAltIcon style={{"animation" : "none"}} />
          <span style={{marginLeft: "10px", fontWeight: "700", fontFamily: "math"}}>
            SAVE .PNG
          </span>
        </Fab>



        <Fab 
        onClick={() => {
          setHidden(true);
          setValue2(value);
          localStorage.setItem("html", textValue);
           
        
        }} 
        
        style={{position: "absolute", marginLeft: "10px", marginBottom: "10px", left: 0, bottom: 0}} variant="extended" color="inherit" aria-label="add">
          <PictureAsPdfIcon style={{"animation" : "none"}} />
          <span style={{marginLeft: "10px", fontWeight: "700", fontFamily: "math"}}>
            PRINT .PDF
          </span>
        </Fab>



      </div>



    <AppBar position="static">
      <Tabs TabIndicatorProps={{style: {background:'white'}}} value={val} onChange={(e) => console.log(e)} aria-label="simple tabs example">
        {/* <Tab onClick={() => setVal(0)} label="Untitled"  /> */}
        {/* <Tab onClick={() => setVal(1)} label="Untitled2"  /> */}

        {/* <Button variant="primary">
          <AddIcon style={{width: "16px", height: "16px", color: "white"}} />
        </Button> */}
      </Tabs>
    </AppBar>


      <Grid container spacing={3}>
        <Grid item xs={6}>
        <textarea
        value={textValue}
      style={{
        "width" : "100%",
        height : "500px",
        fontSize: "13px",
        resize: "vertical",
        float: "left",
        // border: "1px solid rgb(57, 56, 56)",
        // fontSize: "20px"
        
      }}
      
      onChange={(e) => {
        
        let val = e.currentTarget.value;
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

        </Grid>
        <Grid item xs={6}>
          <div id="peos" style={{
            width: "100%",
            background: "white",
            float: "right",
            marginTop: " 10px",
            fontFamily: "math",
            minHeight: "800px",
            margin: "10px",
            overflowWrap: "break-word",
    

            
          }}
          dangerouslySetInnerHTML={{__html: value}}
          ></div>
        </Grid>
      </Grid>

      
      </div>


      <div id="NOTICEME" style={{display: hidden ? "block" : "none", fontFamily: "math", margin: "10px"}}
      
      
      
      dangerouslySetInnerHTML={{__html: value2}}
      >
        
      </div>

    </div>
  );
}

export default App;
