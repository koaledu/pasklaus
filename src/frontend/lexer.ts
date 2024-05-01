// Tokens used for parsing
export enum Token_Type {
  // Literal types
  Null,
  Number,
  Identifier,

  // Keywords
  Let,

  // Brackets and operators
  Open_Paren,
  Close_Paren,
  Equals,
  Binary_Operator,
  EOF,
}

// Looksup keywords, identifiers and symbols
const KEYWORDS: Record<string, Token_Type> = {
  let: Token_Type.Let,
  null: Token_Type.Null,
}

// Represents a single token from the source code
export interface Token {
  value: string,
  type: Token_Type,
}

// Returns a token with a type and value
function token(value = "", type: Token_Type): Token {
  return { value, type };
}

// TODO: Implement emojis for declaring variables
// Examples being Julia and Swift

// Returns whether a given character is in the alphabet [a-z. A-Z]
function is_Alpha(src: string) {
  return src.toUpperCase() !== src.toLowerCase();
}

// Returns true if there's a whitespace character [\s, \t, \n]
function is_Skippable(str: string) {
  return str === " " || str === "\n" || str === "\t";
}

// Returns whether a given character is an integer [0-9]
function is_Int(str: string) {
  const char = str.charCodeAt(0);
  const bounds = ["0".charCodeAt(0), "9".charCodeAt(0)];
  return char >= bounds[0] && char <= bounds[1];
}

// The string that represents source code:
// Produces tokens and handles errors for unidentified characters
export function tokenize(source_Code: string): Token[] {
  const tokens = new Array<Token>();
  const src = source_Code.split("");

  // Build each token until the EOF
  while (src.length > 0) {
    // Begin parsing for one character tokens
    if (src[0] === "(") {
      tokens.push(token(src.shift(), Token_Type.Open_Paren));
    }
    else if (src[0] === ")") {
      tokens.push(token(src.shift(), Token_Type.Close_Paren));
    }
    // Handle binary operators
    else if (
      src[0] === "+" ||
      src[0] === "-" ||
      src[0] === "*" ||
      src[0] === "/" ||
      src[0] === "%"
    ) {
      tokens.push(token(src.shift(), Token_Type.Binary_Operator));
    }
    // Handle conditional and assignment tokens
    else if (src[0] === "=") {
      tokens.push(token(src.shift(), Token_Type.Equals));
    }
    // Handle multicharacter keywords, tokens, identifiers, etc...
    else {
      // Handle numeric literals -> Integers
      if (is_Int(src[0])) {
        let num = "";
        while (src.length > 0 && is_Int(src[0])) {
          num += src.shift();
        }

        // Append a new numeric token
        tokens.push(token(num, Token_Type.Number));
      }

      // Handle identifier and keyword tokens
      else if (is_Alpha(src[0])) {
        let ident = "";
        while (src.length > 0 && is_Alpha(src[0])) {
          ident += src.shift();
        }

        // Check for reserved keywords
        const reserved = KEYWORDS[ident];
        // If value is not undefined then the identifier is a recognized keyword
        if (typeof reserved === "number") {
          tokens.push(token(ident, reserved));
        }
        // Unrecognized name must mean user defined symbol
        else {
          tokens.push(token(ident, Token_Type.Identifier));
        }
      }

      // Skip uneeded characters
      else if (is_Skippable(src[0])) {
        src.shift();
      }

      // Handle unrecognized characters
      else {
        console.error(
          "Unrecognized character found in source code: ",
          src[0].charCodeAt(0),
          src[0],
        );
        process.exit(1); // replace with `Deno.exit(1)` if you are using Deno
      }
    }
  }

  // Reach end of the file
  tokens.push({ type: Token_Type.EOF, value: "End_Of_File" });
  return tokens;
}
