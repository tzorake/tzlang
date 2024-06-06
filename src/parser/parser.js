import { Lexer } from './lexer.js';
import { TokenKind, Token, TokenKindAsString } from './token.js';
import { BlockStatement } from './statements/expressions.js';

export class Parser 
{
  /**
   * @constructor
   * @param {Lexer} lexer
   */
  constructor(lexer) 
  {
    /**
     * @type {Lexer}
     */
    this.lexer = lexer;
    /**
     * @type {Token}
     */
    this.token = this.lexer.nextToken();
  }

  /**
   * @throws {Error}
   * @returns {BlockExpression}
   */
  reset()
  {
    this.lexer.reset();
    this.token = this.lexer.nextToken();
  }

  /**
   * @throws {Error}
   * @returns {Program}
   */
  parse() 
  {
    const statements = [];

    // while (!this.lexer.exhasted) {
    //   const statement = this.parseStatement();

    //   if (statement) {
    //     statements.push(statement);
    //   }
    // }

    return new BlockStatement(statements);
  }

  /**
   * @throws {Error}
   * @returns {void}
   */
  eat(type)
  {
    const tokenKind = this.token.type;
    if (type != tokenKind) {
      throw new Error(`expected ${TokenKindAsString(type)} but got ${TokenKindAsString(tokenKind)}`);
    }

    this.token = this.lexer.nextToken();
  }

  skip(type)
  {
    while (this.token.type === type) {
      this.token = this.lexer.nextToken();
    }
  }

  /**
   * @param {number} [offset=0]
   * 
   * @returns {string | undefined}
   */
  peek(offset = 0)
  {
    return this.lexer.peek(offset);
  }
}