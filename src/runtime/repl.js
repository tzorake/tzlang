import { Parser } from "../parser/parser.js"
import { Environment } from "./environment.js"
import { Interpreter } from "./interpreter.js"
import { TZ_NULL, TZ_NUMBER, TZ_BOOLEAN, } from "./macros.js";
import promptSync from 'prompt-sync';

const prompt = promptSync();

function tzlangRepl() {
  const env = new Environment();
  env.defineConstant("null",  TZ_NULL());
  env.defineConstant("false", TZ_BOOLEAN(false));
  env.defineConstant("true",  TZ_BOOLEAN(true));
  const interpreter = new Interpreter(env);

  while (true) {
    const data = prompt("> ");
    if (!data || data.includes("exit")) {
      return 0;
    }

    try {
      const parser = new Parser();
      const root = parser.parse(data);
      const result = interpreter.evaluate(root);
      
      console.log(result);
    }
    catch (err) {
      console.log(err);
      continue;
    }  
  }

  return 1; // unreachable
}

(() => {
  process.exit(tzlangRepl());
})();