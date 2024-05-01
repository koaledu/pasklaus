import type { Null_Val, Number_Val, Runtime_Val } from "./values.ts";
import type { Binary_Expr, Numeric_Literal, Program, Stmt } from "../frontend/ast.ts";

function eval_program(program: Program): Runtime_Val {
  let last_Evaluated: Runtime_Val = { type: "null", value: "null" } as Null_Val;
  for (const statement of program.body) {
    last_Evaluated = evaluate(statement);
  }
  return last_Evaluated;
}

// Evaluate pure numeric operations with binary operators
function eval_numeric_binary_expr(
  lhs: Number_Val,
  rhs: Number_Val,
  operator: string,
): Number_Val {
  let result: number;

  if (operator === "/" && rhs.value === 0) {
    console.error("Tried to divide by zero!");
  }

  switch (operator) {
    case "+":
      result = lhs.value + rhs.value;
      break;
    case "-":
      result = lhs.value - rhs.value;
      break;
    case "*":
      result = lhs.value * rhs.value;
      break;
    case "/":
      result = lhs.value / rhs.value;
      break;
    default:
      result = lhs.value % rhs.value;
      break;
  }
  return { value: result, type: "number" };
}

// Evaluates expressions following the binary operation type
function eval_binary_expr(binop: Binary_Expr): Runtime_Val {
  const lhs = evaluate(binop.left);
  const rhs = evaluate(binop.right);

  // Supports only numeric operations
  if (lhs.type === "number" && rhs.type === "number") {
    return eval_numeric_binary_expr(
      lhs as Number_Val,
      rhs as Number_Val,
      binop.operator,
    );
  }

  // One or both are NULL
  return { type: "null", value: "null" } as Null_Val;
}

export function evaluate(ast_Node: Stmt): Runtime_Val {
  switch (ast_Node.kind) {
    case "Numeric_Literal":
      return {
        value: ((ast_Node as Numeric_Literal).value),
        type: "number",
      } as Number_Val;
    case "Null_Literal":
      return { value: "null", type: "null" } as Null_Val;
    case "Binary_Expr":
      return eval_binary_expr(ast_Node as Binary_Expr);
    case "Program":
      return eval_program(ast_Node as Program);

    // Handle unimplemented AST types as error
    default:
      console.error(
        "This AST Node has not yet been setup for interpretation",
        ast_Node,
      );
      process.exit(1); // replace with `Deno.exit(1)` if you are using Deno
  }
}
