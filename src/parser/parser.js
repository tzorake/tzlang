import { Lexer } from './lexer.js';
import { TokenKind, Token, TokenKindAsString } from './token.js';
import { Expression, Statement } from './statements/base.js';
import { BinaryExpression, Identifier, NumericLiteral, VariableDeclaration, AssignmentExpression, CallExpression, FunctionExpression, StringLiteral } from './statements/expressions.js';
import { BlockStatement, IfStatement, ForStatement } from './statements/statements.js';

/**
 * @readonly
 * @enum {string}
 */
export const Keyword = {
  Let    : "let",
  Return : "return",
  If     : "if",
  Else   : "else",
  For    : "for",
};

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
    this.token = this.lexer.token(TokenKind.Eof);
  }

  /**
   * @throws {Error}
   * @returns {void}
   */
  reset()
  {
    this.lexer.reset();
    this.token = this.lexer.token(TokenKind.Eof);
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
    this.reset();
    this.lexer.setSource(source);
    this.advance();

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
    return this.fud();
  }

  parseBlockStatement(global = false)
  {
    if (!global) {
      this.eat(TokenKind.OpenCurly);
    }
    this.skip(TokenKind.Eol);

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
      case TokenKind.Identifier: {
        if (this.token.value === Keyword.Let) {
          this.advance();

          const name = this.token.value;
          this.eat(TokenKind.Identifier);

          let value = null;
          if (this.token.type === TokenKind.Equal) {
            this.advance();
            value = this.parseExpression(this.token.precedence);
          }

          return new VariableDeclaration(name, value);
        }

        if (this.token.value === Keyword.If) {
          this.advance();

          this.eat(TokenKind.OpenParen);
          const condition = this.parseExpression();
          this.eat(TokenKind.CloseParen);

          let ifBlock = this.token.type === TokenKind.OpenCurly
            ? this.parseBlockStatement()
            : this.parseStatement();
          let elseBlock = null;
          if (this.token.type === TokenKind.Identifier && this.token.value === Keyword.Else) {
            this.advance();
            elseBlock = this.token.type === TokenKind.OpenCurly
                ? this.parseBlockStatement()
                : this.parseStatement();
          }

          return new IfStatement(condition, ifBlock, elseBlock);
        }

        if (this.token.value === Keyword.For) {
          this.advance();

          this.eat(TokenKind.OpenParen);
          const condition = this.parseExpression();
          this.eat(TokenKind.CloseParen);

          const block = this.token.type === TokenKind.OpenCurly
            ? this.parseBlockStatement()
            : this.parseStatement();

          return new ForStatement(condition, block);
        }
      } break;
    }

    return this.parseExpression();
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
      case TokenKind.Slash:
      case TokenKind.LessThan:
      case TokenKind.LessThanEqual:
      case TokenKind.GreaterThan:
      case TokenKind.GreaterThanEqual:
      case TokenKind.Bar:
      case TokenKind.BarBar:
      case TokenKind.Ampersand:
      case TokenKind.AmpersandAmpersand:
      case TokenKind.EqualEqual: {
        const token = this.token;
        this.advance();

        return new BinaryExpression(
          token,
          left,
          this.parseExpression(token.precedence)
        );
      } break;

      case TokenKind.Equal: {
        const token = this.token;
        this.advance();

        return new AssignmentExpression(
          left,
          this.parseExpression(token.precedence - 1)
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
        const identifier = new Identifier(this.token.value);
        this.advance();

        if (this.token.type === TokenKind.OpenParen) {
          this.advance();

          const args = [];

          if (this.token.type !== TokenKind.CloseParen) {
            let expression = this.parseExpression();
            args.push(expression);

            while (this.token.type !== TokenKind.CloseParen) {
              this.eat(TokenKind.Comma);
              expression = this.parseExpression();
              args.push(expression);
            }
          }

          this.eat(TokenKind.CloseParen);

          return new CallExpression(identifier, args);
        }

        return identifier;
      } break;

      case TokenKind.StringLiteral: {
        const token = this.token;
        this.advance();

        return new StringLiteral(token.value);
      } break;

      case TokenKind.NumericLiteral: {
        const token = this.token;
        this.advance();

        return new NumericLiteral(token.value);
      } break;

      case TokenKind.OpenParen: {
        this.advance();

        const args = [];
        if (this.token.type !== TokenKind.CloseParen) {
          let expression = this.parseExpression();
          args.push(expression);
  
          while (this.token.type !== TokenKind.CloseParen) {
            this.eat(TokenKind.Comma);
            expression = this.parseExpression();
            args.push(expression);
          }
        }

        this.eat(TokenKind.CloseParen);
        this.eat(TokenKind.EqualGreaterThan);

        const block = this.parseBlockStatement();

        return new FunctionExpression(args, block);
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