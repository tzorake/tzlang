import { Lexer } from "../src/parser/lexer.js"
import { Parser } from "../src/parser/parser.js"
// import { Environment } from "../src/runtime/environment.js"
// import { Interpreter } from "../src/runtime/interpreter.js"
// import { TZ_NULL, TZ_NUMBER, TZ_BOOLEAN } from "../src/runtime/macros.js"

const tests = {};
const source = `z * x + 3 * y`;

function createTest(name, fn) {
  tests[name] = fn;
}

createTest("test__lexer_execution", () => {
  // const source = "(null + true - 13) * 3.14159 / 0x1f1f";
  const lexer = new Lexer();
  lexer.setSource(source);
  
  let token;
  while(!lexer.exhasted) {
    token = lexer.nextToken();
    console.log(`${token}`);
  }
  console.log("");
});

createTest("test__parser_execution", () => {
  // const source = "(null + true - 13) * 3.14159 / 0x1f1f";
  const parser = new Parser();
  const root = parser.parse(source);

  console.dir(root, { depth: null });
  console.log("");
});

// createTest("test__interpreter_execution", () => {
//   const source = "x + y";
//   const lexer = new Lexer(source);
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