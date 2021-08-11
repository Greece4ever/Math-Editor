import React, { useEffect, useState, useRef } from "react";
import {renderMarkdown, findAllMath, convertLatex} from './components/renderMain';
import { convertLinks } from './components/replace';

import "./App.css";

import useInterval, {useEffectAllDepsChange} from "./components/hooks";

import Grid from '@material-ui/core/Grid';


import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-markdown";
import "ace-builds/src-noconflict/theme-monokai";

import "ace-builds/src-noconflict/theme-kuroir";
import "ace-builds/src-noconflict/theme-tomorrow";

import "ace-builds/src-noconflict/ext-language_tools"


import Icons from './elementComponents/icons';

import domtoimage from 'dom-to-image';
import { saveAs } from 'file-saver';
import moment from 'moment/min/moment-with-locales'





import {
  enable as enableDarkMode,
  disable as disableDarkMode,
  auto as followSystemColorScheme,
  exportGeneratedCSS as collectCSS,
  isEnabled as isDarkReaderEnabled
} from 'darkreader';


const format = {
  png: "1",
  svg: "2",
  pdf: "3"
} 

const main_color = "rgb(57, 68, 70)";


function App() {
  const [textValue, setTextValue] = useState("");
  const [value, setValue]   = useState([""]);  
  const [value2, setValue2] = useState("");

  const setDarkMode = (val) => {
    if (!val)
      return disableDarkMode();
    enableDarkMode({
      brightness: 100,
      contrast: 90,
      sepia: 10,
    });
  }


  // save localstorage
  useInterval(() => {
    localStorage.setItem("html", textValue)
  }, 15 * 1000);
  

  const [hidden, setHidden] = useState(false);

  // Print End Listener
  useEffect(() => {
    const onPrintEnd = (event) => {
      exitScreenShot()
    }
      
    window.addEventListener("afterprint", onPrintEnd);
    
    return () => {
      window.removeEventListener('afterprint', onPrintEnd);
    }
  }, []);


  const exitScreenShot = () => {
    setHidden(false);
    document.getElementById("NOTICEME").innerHTML = "";
    __render(textValue);
  }

  // Print when hit PRINT .PDF
  useEffect(() => {
    if (hidden) {
      let latexElement = document.getElementById("NOTICEME");
      let type = latexElement.getAttribute("val");
      setMathCode();
      
      switch (type)
      {
        case format.svg:
          replaceKatexTags();
          domtoimage.toSvg(latexElement).then(blob => {    saveAs(blob, `math${Math.random()}.svg`);  exitScreenShot(); });
          break;
        case format.png:
          replaceKatexTags();
          domtoimage.toPng(latexElement).then(blob => {    saveAs(blob, `math${Math.random()}.png`);  exitScreenShot(); });
          break;
        case format.pdf:
            addLinesToCodeBlocks();
            document.title = moment().format("LLLL");
            window.print();
            break;
      } 
    }
    else 
    __render(textValue)
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
  const [links, setLinks] = useState();

  const __render = (val) => {
    let code_symbols, _links;
    [val, _links] = convertLinks(val);
    [val, code_symbols] = findAllMath(val, "```", "kostas", "pre");
    let [str, math_symbols] = findAllMath(val, "$$", "leonidas");

    setValue( [ renderMarkdown(str) ] );
    setMathSymbols( math_symbols )
    setCodeSymbols( code_symbols )
    setLinks(_links);
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
  
  const setMathCode = () => {
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

    elms = document.getElementsByClassName("link69");
    for (let i=0; i < elms.length; i++)
    {
      elms[i].setAttribute("href", links[i]);
    }


  }

  function addLinesToCodeBlocks() {
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
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      addLinesToCodeBlocks();      
    }, 1000)

    return () => clearTimeout(timeout);
  }, [textValue])


  // change between 1 render or multiple renders
  useEffectAllDepsChange(() => {
    let temp1 = document.getElementById("peos");
    setMathCode();
    temp1.scrollTo(0, temp1.offsetHeight)
  }, [value, mathSymbols, codeSymbols, links]);



  const handleChange = e => {
    let val = e;
    setTextValue(val);
    __render(val);
  }


  const save = (_format) => {
    let str_format = format[_format];
    if (!str_format)
      return console.error(`Error: ${_format} not found`);
    
    document.getElementById("NOTICEME").setAttribute("val", str_format);
    setHidden(true);
    setValue2(value);
    localStorage.setItem("html", textValue);
  }

  function replaceKatexTags()
  {
    Array.from( document.getElementsByTagName("mi") ).forEach(i => {
      let q = document.createElement("span");
      q.classList.add("mi");
      q.innerText = i.innerText;
      i.replaceWith(q);

    })

    Array.from( document.getElementsByTagName("mrow") ).forEach(i => {
      let q = document.createElement("span");
      q.classList.add("mrow");
      q.innerText = i.innerText;
      i.replaceWith(q);
    })

    Array.from( document.getElementsByTagName("annotation") ).forEach(i => {
      let q = document.createElement("span");
      q.classList.add("annotation");
      q.innerText = i.innerText;
      i.replaceWith(q);
    })

    Array.from( document.getElementsByTagName("semantics") ).forEach(i => {
      let q = document.createElement("span");
      q.classList.add("semantics");
      q.innerText = i.innerText;
      i.replaceWith(q);
    })


    Array.from( document.getElementsByTagName("math") ).forEach(i => {
      let q = document.createElement("span");
      q.classList.add("math");
      q.innerText = i.innerText;
      i.replaceWith(q);
    })

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
      
      }}>

      </div>

      <Icons save={save} setDarkMode={setDarkMode} />

      <Grid style={{ }} container spacing={3}>
        <Grid ref={_grid} style={{borderRight: `10px solid ${main_color}`, paddingBottom: 0, paddingRight: 0, height: _height}} item xs={6}>
          <AceEditor  
          onLoad={(editor) => {
            editor.session.setNewLineMode("unix");
          }}

          value={textValue}
          style={{width: "100%"}}
          onChange={e => handleChange(e)}
          wrapEnabled={true}
          fontSize={15}
          height={_height - 12}
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
            fontFamily: "'KaTeX_Main'",
            height: "calc(100% - 10px)",

            overflow: "auto",
            wordWrap: "break-word"
          }}

          dangerouslySetInnerHTML={{__html: hidden ? "" : value[0] }}></div>
        </Grid>
      </Grid>
      </div>

      <div dangerouslySetInnerHTML={{__html: value2}} val="0" id="NOTICEME" 
      style={{
        display: hidden ? "block" : "none", 
        fontFamily: "math", 
        margin: "10px", 
        minHeight: window.innerHeight,
      }}
        
        
        ></div>
    </div>
  );
}

export default App;
