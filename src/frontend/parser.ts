import type {
  Program,
  Numeric_Literal,
  Null_Literal,
  Identifier,
  Binary_Expr,
  Expr,
  Stmt,
} from "./ast.ts";

import type {
  Token,
} from "./lexer.ts";

import { tokenize, Token_Type } from "./lexer.ts";

// Frontend for producing a valid AST from the source code
export default class Parser {
  private tokens: Token[] = [];

  // Determines if the parsing is complete and the EOF is reached
  private not_eof(): boolean {
    return this.tokens[0].type !== Token_Type.EOF;
  }

  // Returns the currently available token
  private at() {
    return this.tokens[0] as Token;
  }

  // Returns the previous token and then advances the tokens array to the next
  // value
  private eat() {
    const prev = this.tokens.shift() as Token;
    return prev;
  }

  // Returns the previous token and then advances the tokens array to the next
  // value. Also checks the type of the expected token and throws if the value
  // do not match
  private expect(type: Token_Type, err: any) {
    const prev = this.tokens.shift() as Token;
    if (!prev || prev.type !== type) {
      console.error("Parser Error:\n", err, prev, " - Expecting: ", type);
      process.exit(1); // replace with `Deno.exit(1)` if you are using Deno
    }
    return prev;
  }

  // Create the AST using the source code
  public produce_AST(source_Code: string): Program {
    this.tokens = tokenize(source_Code);
    const program: Program = {
      kind: "Program",
      body: [],
    };

    // Parse until EOF
    while (this.not_eof()) {
      program.body.push(this.parse_stmt());
    }

    return program;
  }

  // Handle complex statement types
  private parse_stmt(): Stmt {
    // Skip to parse_expr
    return this.parse_expr();
  }

  // Handle expressions
  private parse_expr(): Expr {
    return this.parse_additive_expr();
  }

  // Handle addition and substraction operations
  private parse_additive_expr(): Expr {
    let left = this.parse_multiplicitave_expr();

    while (this.at().value === "+" || this.at().value === "-") {
      const operator = this.eat().value;
      const right = this.parse_multiplicitave_expr();
      left = {
        kind: "Binary_Expr",
        left,
        right,
        operator,
      } as Binary_Expr;
    }

    return left;
  }

  // Handle multiplication, division and modulo operations
  private parse_multiplicitave_expr(): Expr {
    let left = this.parse_primary_expr();

    while (
      this.at().value === "/" ||
      this.at().value === "*" ||
      this.at().value === "%"
    ) {
      const operator = this.eat().value;
      const right = this.parse_primary_expr();
      left = {
        kind: "Binary_Expr",
        left,
        right,
        operator,
      } as Binary_Expr;
    }

    return left;
  }

  // Orders
  //   1. Additive_Expr
  //   2. Multiplicitave_Expr
  //   3. Primary_Expr

  // Parse literal values and grouping expressions
  private parse_primary_expr(): Expr {
    const tk = this.at().type;

    // Determine which token we are currently at and return literal value
    switch (tk) {
      // User defined values
      case Token_Type.Identifier:
        return { kind: "Identifier", symbol: this.eat().value } as Identifier;

      case Token_Type.Null:
        this.eat(); // advance pass null keyword
        return { kind: "Null_Literal", value: "null" } as Null_Literal;

      // Constants and numeric constants
      case Token_Type.Number:
        return {
          kind: "Numeric_Literal",
          value: parseFloat(this.eat().value),
        } as Numeric_Literal;

      // Grouping expressions
      case Token_Type.Open_Paren: {
        this.eat();
        const value = this.parse_expr();
        this.expect(
          Token_Type.Close_Paren,
          "Unexpected token found inside parenthesised expression. Expected closing parenthesis",
        );
        return value;
      }

      // Unidentidied tokens and invalid code reached
      default:
        console.error("Unexpected token found during parsing!", this.at());
        process.exit(1); // replace with `Deno.exit(1)` if you are using Deno
    }
  }
}
