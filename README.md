## Math Editor ([demo](https://greece4ever.github.io/Math-Editor/))

![img](https://i.imgur.com/Wa1zsKH.png)

Simple markdown editor that makes writting Latex math easier. it replaces each symbol on the table with it's corresponding latex value on the left

| SYMBOL | LATEX |
| --- | ----------- |
| >= | \ge |
| <=> |  \iff  |
| <= | \le |
| => | \implies |
| +- (+ and - with no space) | \pm |
| sqrt | \sqrt |
| != | \neq |
| <- | \leftarrow |
| -> | \rightarrow |

it also converts `(ab)/cd` to `\frac{ab}{cd}` and `x0` to `x_0` (replace `x` with any character and `0` with any number). Besides `Latex` it converts the following symbols to their correspondir HTML entities

| SYMBOL | HTML |
| --- | ----------- |
| ** | Bold |
| *_ | Italic |
| \n\n | Paragraph |
| ``` | Code |

The "PRINT .PDF" button calls the javascript `print()` function with which you can print/save as pdf a document. This is what happens after hitting the button (windows 10).
![img](https://i.imgur.com/Dw4BGEe.png)
