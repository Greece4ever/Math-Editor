## Math Editor

![img](https://i.imgur.com/rVN2i39.png)

Simple markdown editor that makes writting Latex math easier. It takes all of the following symbols on the left and replaces them with the symbols on the right,

```js
let Latex = [
  ['>=', "\\ge"],
  ["<=>", " \\iff "],
  ['<=', "\\le"],
  ['=>', "\\implies"],
  ["+-", "\\pm"],
  ["sqrt", "\\sqrt"],
  ["!=", "\\neq"],
  [/([A-Za-z]|[^\x00-\x7F])(\d)/g, "$1_$2"], // replace x0 with x_{0}
  ["<-", "\\leftarrow"],
  ["->", "\\rightarrow"],
]
```

It also makes writting fractions easier, converting `(ab)/cd` to `\frac{ab}{cd}`.
