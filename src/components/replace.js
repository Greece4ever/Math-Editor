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
    ['>', "h1"],
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
  