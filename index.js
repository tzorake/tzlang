import fs from "fs"
import { TokenType } from './src/token.js';
import { Lexer } from "./src/lexer.js"
import { Parser } from "./src/parser.js"

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
  
  // lexer test
  let token;
  while((token = lexer.nextToken()).type != TokenType.Eof) {
    console.log(token);
  }
  lexer.reset();
  
  // parser test
  const parser = new Parser(lexer);
  const root = parser.parse();

  console.log("");
  console.log(JSON.stringify(root, null, 2));
}

(() => {
  tzlangCompile(process.argv);
})();