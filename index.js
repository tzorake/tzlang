import fs from "fs"

import { TokenType } from "./src/parser/token.js"
import { Lexer } from "./src/parser/lexer.js"
import { Parser } from "./src/parser/parser.js"

function tzlangCompile(argv)
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
    throw new Error(`File does not exist: ${path}`);
  }

  const lexer = new Lexer(data);

  let token;
  while(!lexer.exhasted()) {
    token = lexer.nextToken()
    console.log(token);
  }
  lexer.reset();

  const parser = new Parser(lexer);
  const root = parser.parse();
  
  console.log("");
  console.log(root);
}

(() => {
  tzlangCompile(process.argv);
})();