import { insert_at } from "./parsing";

export let Latex = [
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
    ["*", "\\cdot"]
  ]


  
export const line_repl = [
    ["#", "<h2>", "</h2><hr></hr>"],


    ['-', "<ul>", "</ul>"],
    ['>', "<blockquote><ul>", "</ul></blockquote>"],
]

export const repl = [
    ["**", "b", "Bold"],
    ["*_", "i", "Italic"],
    ["\n\n", "p", ""],
    ["```", "pre", "Code"],
    ["@@", "center", "Centered Text"],
    ["__", "sup", "Superscript"],
    ["^^", "sub", "Subscript"],
]


export function m(str, times) {
    let string = "";
    for (let i=0; i < times; i++) {
        string += str;
    }
    return string;
}
  


export function fnd(str, pttr, tag) {
    let closing = false;
    while (str.indexOf(pttr) != -1) {
        str = str.replace(pttr, `<${closing ? "/" : ""}${tag}>`);
        closing = !closing;
    }
    return str;
}

function _remove(string, from, to) { // not including to
    return string.substring(0, from) + string.substring(to);
  }
  

export function findLink(str)
{
    let i = str.indexOf("[");

    // [ NOT found
    if (i == -1) 
        return str; 
        
    let restSTR = str.slice(i + 1, str.length); // string after [
    let end_index = restSTR.indexOf("](");


    // ]( NOT found
    if (end_index == -1) 
        return str;
    
    let n_index = restSTR.indexOf("\n");
    
    // see if [ and ]( are in the same line
    if ( (n_index < end_index) && (n_index !== -1) ) 
    {
        console.log("[FIRST] not in same line", i, end_index)
        // split "[" and the rest of the string
        let str1 = str.slice(0,    i + 1); 
        let str2 = _remove(str, 0, i + 1);
        console.log([str1, str2])
        return [str1, str2];
    }

    
    let restRest = restSTR.slice(end_index + 2, restSTR.length); // string after ](

    let j = restRest.indexOf(")");

    // ) not found
    if (j == -1) 
        return str; // if ) is nowhere to be found there will be no more links

    n_index = restRest.indexOf("\n");
    
    // ]( and ) NOT in same line
    if ( (n_index < j) && (n_index !== -1) ) 
    {
        // console.log("]( and ) NOT in same line");
        // console.log("tzei", j)
        let str1 = str.slice(0,    i + end_index + 2  + j + 2);
        let str2 = _remove(str, 0, i + end_index + 2  + j + 2);
        return [str1, str2]
    }
    
    let link = restRest.slice(0, j);
    let desc = restSTR.slice(0, end_index);

    let total_length = (desc.length + 2) + (link.length + 2);


    str = _remove(str, i, i + total_length);

    let str2 = str.substring(0, i);
    let str1 = _remove(str, 0, i);

    
    
    return [str2 + `<a href="${link}" target="_blank" rel="noopener noreferrer">${desc}</a>`, str1];
};


export function removeAtRange(str, x, y) {
    return str.substring(x, y);
}
  

function removeAtRanges(string, start, end)
{   
    return [string.substring(start, end),  string.substring(end, string.length) ]
}


export function __line_replace(string, symbol, open_tag, close_tag)
{
    let $symbol = `\n${symbol}`;    
    let str1 = "";  // part of string that has been dealth with
    let str0 = string; // rest of string we are dealing with

    let len = open_tag.length;

    // TODO: If symbol.length > 1 then bug
    if (str0[0] == symbol)
    {
        str0 = str0.replace(symbol, `${open_tag}`);
        str0 = str0.replace("\n",   `${close_tag}\n`);
    }


    let i = str0.indexOf($symbol);

    while (i !== -1)
    {
        str0 = str0.replace($symbol, `\n${open_tag}`);

        let _ = removeAtRanges(str0, 0, i  + len);
        
        str1 += _[0];
        str0 = _[1];

        str0 = str0.replace("\n", `${close_tag}\n`);
        
        i = str0.indexOf($symbol);
    };

    str1 += str0

    return str1;
}


export function findInside(str, match) {
    let i = str.indexOf(match); str = str.replace(match, ' ');
    let j = str.indexOf(match); str = str.replace(match, ' ');
    return [i, j == -1 ? str.length : j, str];
}

  