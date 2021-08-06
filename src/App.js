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


function App() {
  const [textValue, setTextValue] = useState("");
  const [value, setValue]   = useState([""]);  
  const [value2, setValue2] = useState("");



  useInterval(() => {
    localStorage.setItem("html", textValue)
  }, 15 * 1000);
  


  const [hidden, setHidden] = useState(false);


  // Load previous text from memory
  // useEffect(() => {
  //   let val = localStorage.getItem("html");
  //   if (!val)
  //     return;

  //   setTextValue(val);

  //   line_repl.forEach(i => {
  //     val = line_replace(val, "\n" +i[0], "\n", i[1])
  //   })

  //   repl.forEach(i => {
  //     val = fnd(val, i[0], i[1]);
  //   })

  //   val = replaceMathCenter(val, "$$");
  //   val = replaceMath(val, "@@");

  //   setValue(val);

  // }, [])


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

  
  const [mathSymbols, setMathSymbols] = useState();

  const __render = (val) => {
    let [str, math_symbols] = findAllMath(val, "$$", "leonidas");

    setValue( [ renderMarkdown(str) ] );
    setMathSymbols(math_symbols);
  }

  // change between 1 render or multiple renders
  useEffectAllDepsChange(() => {


    let elms = document.getElementsByClassName("leonidas");
    for (let i=0; i < elms.length; i++)
    {


      elms[i].innerHTML = convertLatex(mathSymbols[i]);
    }

  
  }, [value, mathSymbols]);

  // useEffect(() => {
    

  // }, [value])


  const handleChange = e => {
    let val = e;
    setTextValue(val);

    __render(val);
    // val = renderMarkdown(val);
    // setValue(val);
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

          dangerouslySetInnerHTML={{__html: value[0] }}></div>
        </Grid>
      </Grid>
      </div>

        <div val="0" id="NOTICEME" style={{display: hidden ? "block" : "none", fontFamily: "math", margin: "10px", minHeight: window.innerHeight}} dangerouslySetInnerHTML={{__html: value2}}></div>
    </div>
  );
}

export default App;
