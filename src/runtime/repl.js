import { Lexer } from "../parser/lexer.js"
import { Parser } from "../parser/parser.js"
import { Environment } from "./environment.js"
import { Interpreter } from "./interpreter.js"
import { TZ_NULL, TZ_NUMBER, TZ_BOOLEAN, } from "./macros.js";
import promptSync from 'prompt-sync';

const prompt = promptSync();

function tzlangRepl() {
  const env = new Environment();
  env.define("null", TZ_NULL());
  env.define("true", TZ_BOOLEAN(true));
  env.define("false", TZ_BOOLEAN(false));
  const interpreter = new Interpreter(env);

  while (true) {
    const data = prompt("> ");
    if (!data || data.includes("exit")) {
      return 0;
    }

    // try {
      const lexer = new Lexer(data);
      const parser = new Parser(lexer);
      const root = parser.parse();
      const result = interpreter.evaluate(root);
      
      console.log(result);
    // }
    // catch (err) {
    //   console.log(`${err.name}: ${err.message}`);
    //   continue;
    // }  
  }

  return 1; // unreachable
}

(() => {
  process.exit(tzlangRepl());
})();