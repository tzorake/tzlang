import { Lexer } from "../src/parser/lexer.js"
import { Parser } from "../src/parser/parser.js"
import { Interpreter } from "../src/runtime/interpreter.js"
import { Environment } from "../src/runtime/environment.js"
import { TZ_NULL, TZ_NUMBER, TZ_BOOLEAN } from "../src/runtime/macros.js"

const tests = {};

function createTest(name, fn) {
  tests[name] = fn;
}

createTest("test__lexer_execution", () => {
  const data = "(null + true - 13) * 3.14 / 0x1f1f";
  const lexer = new Lexer(data);
  
  let token;
  while(!lexer.exhasted) {
    console.log(token);
    token = lexer.nextToken();
  }
  console.log("");
});

createTest("test__parser_execution", () => {
  const data = "(null + true - 13) * 3.14 / 0x1f1f";
  const lexer = new Lexer(data);
  const parser = new Parser(lexer);
  const root = parser.parse();

  console.log(root);
  console.log("");
});

createTest("test__interpreter_execution", () => {
  const data = "true";
  const lexer = new Lexer(data);
  const parser = new Parser(lexer);
  const root = parser.parse();

  const env = new Environment();
  env.define("null", TZ_NULL());
  env.define("x", TZ_NUMBER(3));
  env.define("y", TZ_NUMBER(8));
  env.define("true", TZ_BOOLEAN(true));
  env.define("false", TZ_BOOLEAN(false));

  const interpreter = new Interpreter(env);
  const result = interpreter.evaluate(root);

  console.info(result);
  console.log("");
});

(() => {
  for (const name in tests) {
    tests[name]();
  }
})();