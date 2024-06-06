import { Lexer } from './lexer.js';
import { TokenType, Token, TokenTypeAsString } from './token.js';
import { Program, Identifier, NumericLiteral, StringLiteral, BinaryExpression, BinaryOperator, Precedence, Keyword, VariableDeclaration, NodeKind, Expression, BlockExpression } from './statements.js';

// statement
// expression
// block_expression
// binary_operation

// let name\n
// let name = expression\n
// a = b\n

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

    while (!this.lexer.exhasted) {
      const statement = this.parseStatement();

      if (statement) {
        statements.push(statement);
      }
    }

    return new Program(statements);
  }

  /**
   * @throws {Error}
   * @returns {Expression | null}
   */
  parseStatement()
  {
    this.skip(TokenType.NewLine);

    if (this.token.type === TokenType.Eof) {
      return null;
    }

    return this.parseExpression();
  }

  /**
   * @throws {Error}
   * @returns {Expression}
   */
  parseExpression()
  {
    switch (this.token.type) {
      case TokenType.Identifier: {
        if (this.token.value === Keyword.Let) {
          return this.parseVariableDeclaration();
        }
      } break;

      case TokenType.OpenCurly: {
        return this.parseBlock();
      } break;
    }

    return this.parseBinaryExpression();
  }

  /**
   * @throws {Error}
   * @returns {Expression}
   */
  parseBinaryExpression()
  {
    return this.parseBinaryExpression__precedence_3();
  }

  /**
   * @throws {Error}
   * @returns {Expression}
   */
  parseBinaryExpression__precedence_3()
  {
    return this.parseBinaryExpressionWithPrecedence(
      Precedence.Precedence3, 
      () => this.parseBinaryExpression__precedence_2(),
      () => this.parseBinaryExpression__precedence_3(),
      NodeKind.AssignmentExpression
    );
  }

  /**
   * @throws {Error}
   * @returns {Expression}
   */
  parseBinaryExpression__precedence_2()
  {
    return this.parseBinaryExpressionWithPrecedence(
      Precedence.Precedence2, 
      () => this.parseBinaryExpression__precedence_1(),
      () => this.parseBinaryExpression__precedence_1(),
      NodeKind.BinaryExpression
    );
  }

  /**
   * @throws {Error}
   * @returns {Expression}
   */
  parseBinaryExpression__precedence_1()
  {
    return this.parseBinaryExpressionWithPrecedence(
      Precedence.Precedence1, 
      () => this.parsePrimaryExpression(),
      () => this.parsePrimaryExpression(),
      NodeKind.BinaryExpression
    );
  }

  /**
   * @throws {Error}
   * @returns {Expression}
   */
  parseBinaryExpressionWithPrecedence(precedence, leftPrecedenceConsumer, rightPrecedenceConsumer, kind)
  {
    let left = leftPrecedenceConsumer();
    while (Object.hasOwn(BinaryOperator[precedence], this.token.type)) {
      const operator = this.token;
      this.eat(operator.type);
      const right = rightPrecedenceConsumer();
      left = new BinaryExpression(operator, left, right, kind);
    }

    return left;
  }

  /**
   * @throws {Error}
   * @returns {Expression}
   */
  parsePrimaryExpression()
  {
    switch (this.token.type) {
      case TokenType.Identifier: {
        return this.parseIdentifier();
      } break;

      case TokenType.NumericLiteral: {
        return this.parseNumericLiteral();
      } break;

      case TokenType.StringLiteral: {
        return this.parseStringLiteral();
      } break;

      case TokenType.OpenParen: {
        this.eat(TokenType.OpenParen);
        const value = this.parseExpression();
        this.eat(TokenType.CloseParen);

        return value;
      } break;

      default: {
        throw new Error(`unexpected token: ${TokenTypeAsString(this.token.type)}`);
      }
    }
  }

  /**
   * @throws {Error}
   * @returns {Identifier}
   */
  parseIdentifier()
  {
    const value = this.token.value;
    this.eat(TokenType.Identifier);

    return new Identifier(value);
  }

  /**
   * @throws {Error}
   * @returns {NumericLiteral}
   */
  parseNumericLiteral()
  {
    const value = Number(this.token.value);
    this.eat(TokenType.NumericLiteral);

    return new NumericLiteral(value);
  }

  /**
   * @throws {Error}
   * @returns {StringLiteral}
   */
  parseStringLiteral()
  {
    const value = this.token.value;
    this.eat(TokenType.StringLiteral);

    return new StringLiteral(value);
  }

  /**
   * @throws {Error}
   * @returns {VariableDeclaration}
   */
  parseVariableDeclaration()
  {
    this.eat(TokenType.Identifier);

    const name = this.token.value;
    this.eat(TokenType.Identifier);

    let value = null;
    if (this.token.type === TokenType.Equal) {
      this.eat(TokenType.Equal);
      value = this.parseExpression();
    }

    if (this.token.type === TokenType.NewLine || this.token.type === TokenType.Eof) {
      this.eat(this.token.type);
    } else {
      throw new Error(`expected ${TokenTypeAsString(TokenType.NewLine)} or ${TokenTypeAsString(TokenType.Eof)} but got ${TokenTypeAsString(this.token.type)}`);
    }

    return new VariableDeclaration(name, value);
  }

  parseBlock()
  {
    this.eat(TokenType.OpenBrace);
    const statements = [];
    while (this.token.type !== TokenType.CloseBrace) {
      statements.push(this.parseStatement());
    }
    this.eat(TokenType.CloseBrace);
    
    return new BlockExpression(statements);
  }

  /**
   * @throws {Error}
   * @returns {void}
   */
  eat(type)
  {
    const tokenType = this.token.type;
    if (type != tokenType) {
      throw new Error(`expected ${TokenTypeAsString(type)} but got ${TokenTypeAsString(tokenType)}`);
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