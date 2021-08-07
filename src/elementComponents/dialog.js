import { Dialog, LinearProgress } from "@material-ui/core";
import React, { useState } from "react";


import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


import { Latex, repl, line_repl } from "../components/replace";
import { convertLatex, convertLinks } from "../components/renderMain"


import SimpleTable from './table';
import HelpIcon from '@material-ui/icons/Help';


function convertDict(latex_array)
{
    let obj = [];
    obj.push({"first": convertLatex("(1)/(4πε0)"), "second": "(1)/(4πε0)", "third": "Fraction (a)/(b) is converted to \\frac{a}{b}" });
    for (let i=0; i < latex_array.length; i++)
    {
        let dict;
        if (latex_array[i][0] === "sqrt")
            dict = ({"first": convertLatex("sqrt {x + 1}"), "second": "sqrt {x + 1}"});
        else if (latex_array[i][1] === "$1_$2")
            dict = ({"first": convertLatex("x0"), "second": "x0"})    
        else
            dict = ({"first": convertLatex(latex_array[i][1]), "second": latex_array[i][0]})

        dict["third"] = latex_array[i][2];

        obj.push(dict);

    }

    return obj;
}


function convertDict2(html_array, line_arr, word="Math")
{
    let arr = [ ];

    let page = "https://github.com/Greece4ever";
    let _link = `[${word}](${page})`;
    
    arr.push({first: convertLinks(_link), second: _link, third: "Link" })

    arr.push({first: convertLatex("x^2 = -1"), second: "$$ x^2 = - 1 $$", third: "Use $$ to write math" })

    for (let i=0; i < html_array.length; i++)
    {
        let obj = {};
        let tag  = html_array[i][1];
        let mdown = html_array[i][0];
        
        if (!tag === "pre")
            obj.first   = `<${tag}>${word}</${tag}>`;
        else
            obj.first   = `<${tag}><span>${word}</span></${tag}>`;

        obj.second  = `${mdown}${word}${mdown}`;
        obj.third   =  html_array[i][2]

        arr.push(obj);
    }

    for (let i=0; i < line_arr.length; i++)
    {
        let obj = {};

        obj.first  = line_arr[i][1] + word + line_arr[i][2];
        obj.second = line_arr[i][0] + word
        obj.third = line_arr[i][3]

        arr.push(obj);
    }
    

    return arr;
}




const HelpDialog = (props) => {

    const [latexTable, setLatexTable] = useState(convertDict(Latex));
    const [htmlTable, setHtmlTable]   = useState(convertDict2(repl, line_repl));

    return (
        <Dialog onClose={() => props.setOpen(false)} className={"XAXAXAXA"}  maxWidth={"xl"}  open={props.open}>

            <DialogTitle style={{background: "radial-gradient(#acacac, transparent)"}}>
                <div style={{    display: 'flex',    alignItems: 'center',    flexWrap: 'wrap',}}>
                    <HelpIcon style={{width: "24x", height: "24px"}} />
                    <span style={{marginLeft: "5px"}}>Formatting help</span>
                </div>
            </DialogTitle>
                <DialogContent className={"PEOSPEOSPEOS"}>
                <DialogContentText style={{wordWrap: "break-word"}}>
                    Below you can find 2 tables
                    <ul> 1. <a href="" onClick={(e) => {
                        e.preventDefault();
                        document.getElementsByClassName("PEOSPEOSPEOS")[0].scrollTop += document.getElementById("table0").getBoundingClientRect().top - 100;
                        } }>Latex</a>: Symbols are replaced only when inside $$ $$, (e.g $$ >= $$ )</ul>

                    <ul> 2. <a href="#" onClick={e => {
                        e.preventDefault();
                        document.getElementsByClassName("PEOSPEOSPEOS")[0].scrollTop += document.getElementById("table1").getBoundingClientRect().top - 100;

                        
                    }}>HTML</a> are replaced everywhere but inside $$ (math) and ``` (code)</ul>
                    
                    You type the symbols in the <b>markdown</b> tab, then they output whatever is in the other tab

                </DialogContentText>
            

            <SimpleTable id={"table0"} first={"Latex"} second={"Markdown"} table={latexTable}></SimpleTable>

            <SimpleTable id={"table1"} first={"HTML"} second={"Markdown"} table={htmlTable}></SimpleTable>


            </DialogContent>



        </Dialog>
    )
}

export default HelpDialog;