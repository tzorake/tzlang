import fs from "fs"

import { Parser } from "./src/parser/parser.js"
import { Environment } from "./src/runtime/environment.js"
import { Interpreter } from "./src/runtime/interpreter.js"
import { tzNull, tzFloat, tzBoolean } from "./src/runtime/macros.js"
import { tzInspectObject } from "./src/parser/macros.js"

function tzInterpret(argv)
{
  const path = argv[2];
  let data = "";
  if (fs.existsSync(path)) {
    try {
      data = fs.readFileSync(path, 'utf8');
    } catch (err) {
      throw err;
    }
  } else {
    throw new Error(`file does not exist: ${path}`);
  }

  const parser = new Parser();
  const root = parser.parse(data);
  const env = new Environment();
  env.defineConstant("null",  tzNull());
  env.defineConstant("false", tzBoolean(false));
  env.defineConstant("true",  tzBoolean(true));
  env.define("x", tzFloat(3));
  env.define("y", tzFloat(8));

  const interpreter = new Interpreter(env);
  const result = interpreter.evaluate(root);

  tzInspectObject(result);
}

(() => {
  tzInterpret(process.argv);
})();