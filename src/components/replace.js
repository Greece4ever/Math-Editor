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
  ]

  
export const line_repl = [
    // ...hdrs(),
    ['-', "ul"],
    ['>', "blockquote"],
]


export const repl = [
    ["**", "b", "Bold"],
    ["*_", "i", "Italic"],
    ["\n\n", "p", ""],
    ["```", "pre", "Code"],
    ["@@", "center", "Centered Text"]
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


function replace_after(str, pttr, rpl, after) {
    return str.slice(0, after) + str.slice(after).replace(pttr, rpl)
}
  

export function removeAtRange(str, x, y) {
    return str.substring(x, y);
}
  

function removeAtRanges(string, start, end)
{   
    return [string.substring(start, end),  string.substring(end, string.length) ]
}

export function line_replace(str, pttr0, pttrn1, rpl) {
    let i = str.indexOf(pttr0);
    while (i != -1) {
        str = str.replace(pttr0, `<${rpl}>`);
        str =  replace_after(str, pttrn1, `</${rpl}>\n`, i);
    
        str += "\n"

        i = str.indexOf(pttr0);
    }
    return str;
}

export function __line_replace(string, symbol, html_tag)
{
    let $symbol = `\n${symbol}`;    
    let str1 = "";  // part of string that has been dealth with
    let str0 = string; // rest of string we are dealing with

    let len = html_tag.length + 2;

    if (str0[0] == symbol)
    {
        str0 = str0.replace(symbol, `<${html_tag}>`);
        str0 = str0.replace("\n", `</${html_tag}>\n`);
        
    }


    let i = str0.indexOf($symbol);

    while (i !== -1)
    {
        // \n-
        // <li>
        str0 = str0.replace($symbol, `\n<${html_tag}>`);

        let _ = removeAtRanges(str0, 0, i  + len);
        
        str1 += _[0];
        str0 = _[1];

        str0 = str0.replace("\n", `</${html_tag}>\n`);
        
        // debugger;
        i = str0.indexOf($symbol);
    };

    str1 += str0

    return str1;
}


let ___DO_NOT_USE = `

> Η ελλάς φλέγεται
-δσα
-δσαδσα
-δσα


`.trim();

//console.log( line_replace(___DO_NOT_USE, "\n" + "-", "\n", "li"));

___DO_NOT_USE = __line_replace(___DO_NOT_USE, "-", "ul");
console.log( ___DO_NOT_USE );
console.log( __line_replace(___DO_NOT_USE, ">", "h1") );

  

export function findInside(str, match) {
    let i = str.indexOf(match); str = str.replace(match, ' ');
    let j = str.indexOf(match); str = str.replace(match, ' ');
    return [i, j == -1 ? str.length : j, str];
}

function hdrs() {
    let arr = [];
    for (let i=1; i <= 4; i++) {
      arr.push([m("#", i), `h${i}`]);
    }
    arr.reverse();
    return arr;
  }
  