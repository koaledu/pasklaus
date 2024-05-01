import Parser from "./src/frontend/parser.ts";
import { evaluate } from "./src/runtime/interpreter.ts";
repl();

function repl() {
  const parser = new Parser();
  console.log("\nPasklaus Repl v0.1");

  // Continue Repl until the user stops or types `exit` or `quit`
  while (true) {
    const input = prompt("> ");
    // Check for no user input or stop keywords
    if (!input || input.includes("exit") || input.includes("quit")) {
      process.exit(1); // replace with `Deno.exit(1)` if you are using Deno
    }

    // Produce the AST from source code
    const program = parser.produce_AST(input);

    const result = evaluate(program);
    console.log(result);
  }
}
