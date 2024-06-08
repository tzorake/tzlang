import { Parser } from "../parser/parser.js"
import { Environment } from "./environment.js"
import { Interpreter } from "./interpreter.js"
import { tzNull, tzFloat, tzBoolean, } from "./macros.js";
import promptSync from 'prompt-sync';

const prompt = promptSync();

function tzRepl() {
  const env = new Environment();
  env.defineConstant("null",  tzNull());
  env.defineConstant("false", tzBoolean(false));
  env.defineConstant("true",  tzBoolean(true));
  const interpreter = new Interpreter(env);

  while (true) {
    const data = prompt("> ");
    if (!data || data.includes("exit")) {
      break
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

  return 0;
}

(() => {
  process.exit(tzRepl());
})();