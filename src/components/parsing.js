export function splitAtRange(str, x, y) {
  return str.substring(0, x) + str.substring(y, str.length);
}

export function insert_at(str, insrt, pos) {
  return str.slice(0, pos) + insrt + str.slice(pos, str.length);
}

let nums = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

/* Return starting and ending index of outter-most parentheses */

// Heading to the right ---->
function mathRightPar(str, start_index) {
  let i = start_index; // of parentheses 
    let j = 0;
  let states = [];
    for (j=i; j < str.length; j++) {
        if (str[j] === "(") {
            states.push(1)
      // Parenteses Found at j creating [ states.length, j];
    }
        else if (str[j] == ")") {
            // Parenteses poped at j matching [states.length];
            states.pop();
            if (!states.length)
                break;
        }
    }
    return [i, j + 1];
}

// Heading to the left <----
function matchLeftPar(str, start_index) {
  let i = start_index; // of parentheses 
  let j = 0;
  let states = [];
    for (j=i; j > 0; j--) {
        if (str[j] === ")") {
            states.push(1)
      // Parenteses Found at j creating [ states.length, j];
    }
        else if (str[j] == "(") {
            // Parenteses poped at j matching [states.length];
            states.pop();
            if (!states.length)
                break;
        }
    }
    return [j, i + 1];
}

// find repeating number character in string at index
function num(str, index, inc=1, comp) {
  let char;
	let i;
  for (i=index; comp(i); i += inc) 
  {
    char = str[i];
    if (!nums.includes(char)) 
      break;
  }
  
  if (inc === -1) // Reverse if backwards
		return [i + 1, index + 1];  
  return [index, i];
}

/* 
	 Find the number | prentheses (heading to left or right when inc=-1 or inc=1) 
	 after div (/) symbol and return starting and ending index 
   as an array of [start, end]
*/
function handle_num(str, index, inc=1) {
  let comp, j;
  if (inc === 1) // Forward
    comp = x => x < str.length;
  else
    comp = x => x >= 0; // TODO x > 0 should be x >= (BEGGINING OF "(" BRACKETS)

  for (j=(index + inc); comp(j); j += inc)  { // Keep searching until whitespace is cleared
    if (str[j] !== " ") {
      // Parentheses
      if (str[j] === "(") { 
          if (inc === 1) // "(" can only be found when searching <---
        		return mathRightPar(str, j);            
      }
      else if (str[j] == ")") {
        if (inc === -1) { // ")" can only be found when searching <---
          return matchLeftPar(str, j);            
        }
      }
			
      // Single character | number
      if (!nums.includes(str[j]))         
        return [j, j +1]
      else
        return num(str, j, inc, comp);
    }
  }
}

// Get rid of outter parentheses
function hpar(str) {
	if (str[0] == "(") {
		return str.trim().substring(1, str.length - 1);
  }
  return str.trim();
}

// Convert only one
function replace_frac(str, index) {
  let right = handle_num(str, index, 1);
  let left  = handle_num(str, index, -1);
  
  	let numerator 	= hpar (str.substring(left[0], left[1]))
  	let denominator = hpar (str.substring(right[0], right[1]));
  let to_latex = `\\frac{${numerator}}{${denominator}}`;
     
  let split_str = splitAtRange(str, left[0], right[1]); // Rest of the string
  return insert_at(split_str, to_latex, left[0])
}


// Convert all fractions (ie 1/5) to latex (\frac{1}{5})
export default function convertFraction(str) {
	let cstr = str;
	let index = cstr.indexOf("/");
  while (index != -1) {
		cstr = replace_frac(cstr, index);
    index = cstr.indexOf("/");
  }
  return cstr;
}
