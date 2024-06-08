import { Lexer } from './lexer.js';
import { TokenKind, Token, TokenKindAsString } from './token.js';
import { BinaryExpression, Expression, Identifier, NumericLiteral } from './statements/expressions.js';
import { Statement, BlockStatement } from './statements/statements.js';

export class Parser 
{
  /**
   * @constructor
   */
  constructor() 
  {
    /**
     * @type {Lexer}
     */
    this.lexer = new Lexer();
    /**
     * @type {Token}
     */
    this.token = new Token(TokenKind.Eof);
  }

  /**
   * @returns {string}
   */
  toString()
  {
    return `<Parser lexer=${this.lexer} token=${this.token}>`;
  }

  /**
   * @throws {Error}
   * @returns {void}
   */
  reset()
  {
    this.lexer.reset();
    this.advance();
  }

  advance()
  {
    this.token = this.lexer.nextToken();
  }

  /**
   * @throws {Error}
   * @returns {BlockStatement}
   */
  parse(source) 
  {
    this.lexer.setSource(source);
    this.reset();

    return this.parseBlockStatement(true);
  }

  parseExpression(precedence = 0)
  {
    let left = this.nud();

    while (precedence < this.token.precedence) {
      left = this.led(left);
    }

    return left;
  }

  parseStatement()
  {    
    const fud = this.fud();
    if (fud !== null) {
      this.advance();
      
      return fud;
    }

    return this.parseExpression();
  }

  parseBlockStatement(global = false)
  {
    if (!global) {
      this.eat(TokenKind.OpenCurly);
    }
    
    const statements = [];
    while (global && this.token.type !== TokenKind.Eof || !global && this.token.type !== TokenKind.CloseCurly) {
      const statement = this.parseStatement();
      statements.push(statement);

      this.skip(TokenKind.Eol);
    }

    if (!global) {
      this.eat(TokenKind.CloseCurly);
    }

    return new BlockStatement(statements);
  }
  
  /**
   * @throws {Error}
   * @returns {Statement | null}
   */
  fud()
  {
    switch (this.token.type) {
    }

    return null;
  }

  /**
   * @param {Expression} left
   * 
   * @throws {Error}
   * @returns {Expression | null}
   */
  led(left)
  {
    switch (this.token.type) {
      case TokenKind.Plus:
      case TokenKind.Minus:
      case TokenKind.Asterisk:
      case TokenKind.Slash: {
        const token = this.token;
        this.advance();

        return new BinaryExpression(
          token, 
          left, 
          this.parseExpression(token.precedence)
        );
      } break;
    }

    throw new Error(`unexpected token: ${TokenKindAsString(this.token.type)}`);
  }

  /**
   * @throws {Error}
   * @returns {Expression | null}
   */
  nud()
  {
    switch (this.token.type) {
      case TokenKind.Identifier: {
        const token = this.token;
        this.advance();

        return new Identifier(token.value);
      } break;

      case TokenKind.NumericLiteral: {
        const token = this.token;
        this.advance();

        return new NumericLiteral(token.value);
      } break;

      case TokenKind.OpenParen: {
        this.advance();
        const expression = this.parseExpression();
        this.eat(TokenKind.CloseParen);

        return expression;
      } break;
    }

    return null;
  }

  /**
   * @param {TokenKind} type
   * 
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

    /**
   * @param {TokenKind} type
   * 
   * @throws {Error}
   * @returns {void}
   */
  skip(type)
  {
    while (this.token.type === type) {
      this.token = this.lexer.nextToken();
    }
  }
}