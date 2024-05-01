// Creates custom types for the AST
export type Node_Type =
  | "Program"
  | "Numeric_Literal"
  | "Null_Literal"
  | "Identifier"
  | "Binary_Expr";

// Statements do not result in a value at runtime
// They contain one or more expressions internally
export interface Stmt {
  kind: Node_Type;
}

// Defines a block which contains many Statements
// Only one program will be contained in a file
export interface Program extends Stmt {
  kind: "Program";
  body: Stmt[];
}

// Expressions will result in a value at runtime unlike statements
export interface Expr extends Stmt {}

// A operation with two sides separated by a operator
// Supported operators -> + | - | * | / | %
export interface Binary_Expr extends Expr {
  kind: "Binary_Expr";
  left: Expr;
  right: Expr;
  operator: string;
}

// Represents a user-defined variable or symbol in source
export interface Identifier extends Expr {
  kind: "Identifier";
  symbol: string;
}

// Represents a numeric constant inside the source code
export interface Numeric_Literal extends Expr {
  kind: "Numeric_Literal";
  value: number;
}

// Defines a value with no meaning or undefined behavior
export interface Null_Literal extends Expr {
  kind: "Null_Literal";
  value: "null";
}
