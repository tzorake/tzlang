import fs from "fs"

import { Parser } from "./src/parser/parser.js"
import { Environment } from "./src/runtime/environment.js"
import { Interpreter } from "./src/runtime/interpreter.js"
import { tzNull, tzFloat, tzBoolean, tzFunction } from "./src/runtime/macros.js"
import { tzInspectObject, tzLog } from "./src/parser/macros.js"

const Configuration = {
  EnableResultLogging: false
}

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
  env.defineConstant("print", tzFunction((args, env) => { 
    console.info(...args); 

    return tzNull();
  }));
  env.define("x", tzFloat(3));
  env.define("y", tzFloat(8));

  const interpreter = new Interpreter();
  const result = interpreter.evaluate(root, env);

  if (Configuration.EnableResultLogging) {
    tzLog("Root:");
    tzInspectObject(root);
    tzLog("");
    tzLog("Result:");
    tzInspectObject(result);
  }
}

(() => {
  tzInterpret(process.argv);
})();