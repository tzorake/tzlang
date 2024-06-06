import { Lexer } from "../src/parser/lexer.js"
import { Parser } from "../src/parser/parser.js"
// import { Environment } from "../src/runtime/environment.js"
// import { Interpreter } from "../src/runtime/interpreter.js"
// import { TZ_NULL, TZ_NUMBER, TZ_BOOLEAN } from "../src/runtime/macros.js"

const tests = {};

function createTest(name, fn) {
  tests[name] = fn;
}

createTest("test__lexer_execution", () => {
  const data = "(null + true - 13) * 3.14 / 0x1f1f";
  const lexer = new Lexer(data);
  
  let token;
  while(!lexer.exhasted) {
    token = lexer.nextToken();
    console.log(token);
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

// createTest("test__interpreter_execution", () => {
//   const data = "x + y";
//   const lexer = new Lexer(data);
//   const parser = new Parser(lexer);
//   const root = parser.parse();

//   const env = new Environment();
//   env.defineConstant("null",  TZ_NULL());
//   env.defineConstant("false", TZ_BOOLEAN(false));
//   env.defineConstant("true",  TZ_BOOLEAN(true));
//   env.define("x", TZ_NUMBER(3));
//   env.define("y", TZ_NUMBER(8));

//   const interpreter = new Interpreter(env);
//   const result = interpreter.evaluate(root);

//   console.info(result);
//   console.log("");
// });

(() => {
  for (const name in tests) {
    tests[name]();
  }
})();