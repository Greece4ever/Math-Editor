import React, { useEffect, useState, useRef } from "react";
// import katex from "katex";

// import convertFraction, { insert_at, splitAtRange } from "./components/parsing";
// import {Latex, line_repl, repl, m, fnd, removeAtRange, line_replace, findInside} from './components/replace'
import {renderMarkdown, findAllMath, convertLatex} from './components/renderMain';

import html2canvas from 'html2canvas';

import "./App.css";

import useInterval, {useEffectAllDepsChange} from "./components/hooks";

import Fab from '@material-ui/core/Fab';

import Grid from '@material-ui/core/Grid';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';


import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-markdown";
import "ace-builds/src-noconflict/theme-monokai";

import "ace-builds/src-noconflict/theme-kuroir";
import "ace-builds/src-noconflict/theme-tomorrow";

import "ace-builds/src-noconflict/ext-language_tools"


import ImageIcon from '@material-ui/icons/Image';
import HelpIcon from '@material-ui/icons/Help';
import Icons from './elementComponents/icons';

// import Dialog from '@material-ui/core/Dialog';
import HelpDialog from './elementComponents/dialog'
import domtoimage from 'dom-to-image';
import { saveAs } from 'file-saver';


import {
  enable as enableDarkMode,
  disable as disableDarkMode,
  auto as followSystemColorScheme,
  exportGeneratedCSS as collectCSS,
  isEnabled as isDarkReaderEnabled
} from 'darkreader';





function App() {
  const [textValue, setTextValue] = useState("");
  const [value, setValue]   = useState([""]);  
  const [value2, setValue2] = useState("");


  // useEffect(() => {
  //   enableDarkMode({
  //     brightness: 100,
  //     contrast: 90,
  //     sepia: 10,
  // });
  
  // }, [])

  useInterval(() => {
    localStorage.setItem("html", textValue)
  }, 15 * 1000);
  


  const [hidden, setHidden] = useState(false);


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
        
        domtoimage.toSvg(document.getElementById("NOTICEME")).then(blob => {
          saveAs(blob, `math${Math.random()}.svg`)
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

  
  const [mathSymbols, setMathSymbols] = useState();
  const [codeSymbols, setCodeSymbols] = useState();

  const __render = (val) => {

    let code_symbols;
    [val, code_symbols] = findAllMath(val, "```", "kostas", "pre");
    let [str, math_symbols] = findAllMath(val, "$$", "leonidas");

    setValue( [ renderMarkdown(str) ] );
    setMathSymbols(math_symbols)
    setCodeSymbols( code_symbols )
  }

  const addLineNumbers = (codeString) =>
  {
    let q= codeString.split("\n");
    let d = [];
    for (let i=0; i < q.length; i++)
    {
      let c = document.createElement("span");
      c.innerText = q[i];
      d.push(c);
    }
    return d;
  }
  

  useEffect(() => {
    const timeout = setTimeout(() => {
      let elms = document.getElementsByClassName("kostas");
      for (let i=0; i < elms.length; i++)
      {
        let elms2 = addLineNumbers(elms[i].innerText);
        elms[i].innerText = "";
        for (let k=0; k < elms2.length; k++)
        {
          elms[i].appendChild(elms2[k]);
          elms[i].innerHTML += "\n";
        }
      }
      
    }, 1000)

    return () => clearTimeout(timeout);
  }, [textValue])

  // change between 1 render or multiple renders
  useEffectAllDepsChange(() => {


    let elms = document.getElementsByClassName("leonidas");
    for (let i=0; i < elms.length; i++)
    {
      elms[i].innerHTML = convertLatex(mathSymbols[i]);
    }
    elms = document.getElementsByClassName("kostas");

    for (let i=0; i < elms.length; i++)
    {
      elms[i].innerText = codeSymbols[i].trim();
    }

  }, [value, mathSymbols, codeSymbols]);



  const handleChange = e => {
    let val = e;
    setTextValue(val);
    __render(val);
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

  const [dialogOpen, setDialogOpen] = useState(false);


  const [saveOpen, setSaveOpen] = useState(false);

  return (
    <div className="App">

      <HelpDialog open={dialogOpen} setOpen={setDialogOpen} />

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

      <Icons />

      <Grid style={{ }} container spacing={3}>
        <Grid ref={_grid} style={{borderRight: `10px solid ${main_color}`, paddingBottom: 0, paddingRight: 0, height: _height}} item xs={6}>
          <AceEditor  
          value={textValue}
          style={{width: "100%"}}



          onChange={e => handleChange(e)}
          wrapEnabled={true}
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

          dangerouslySetInnerHTML={{__html: value[0] }}></div>
        </Grid>
      </Grid>
      </div>

        <div val="0" id="NOTICEME" style={{display: hidden ? "block" : "none", fontFamily: "math", margin: "10px", minHeight: window.innerHeight}} dangerouslySetInnerHTML={{__html: value2}}></div>
    </div>
  );
}

export default App;
