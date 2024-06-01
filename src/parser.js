import { TokenType, TokenTypeAsString } from './token.js';
import { Program, Identifier, NullLiteral, BooleanLiteral, NumericLiteral, StringLiteral, BinaryExpression, BinaryOperator } from './statements.js';

export class Parser 
{
  constructor(lexer) 
  {
    this.lexer = lexer;
    this.token = this.lexer.nextToken();
  }

  reset()
  {
    this.lexer.reset();
    this.token = this.lexer.nextToken();
  }

  parse() 
  {
    const statements = [];

    while (this.token.type !== TokenType.Eof) {
      const statement = this.parseStatement();

      statements.push(statement);
    }

    return new Program(statements);
  }

  parseStatement()
  {
    return this.parseExpression();
  }

  parseBinaryExpression()
  {
    return this.parseBinaryExpression__precedence_2();
  }

  parseBinaryExpression__precedence_2()
  {
    let left = this.parseBinaryExpression__precedence_1();
    while (Object.hasOwn(BinaryOperator.Precedence1, this.token.type)) {
      const operator = this.token;
      this.eat(operator.type);
      const right = this.parseBinaryExpression__precedence_1();
      left = new BinaryExpression(operator, left, right);
    }

    return left;
  }

  parseBinaryExpression__precedence_1()
  {
    let left = this.parsePrimaryExpression();
    while (Object.hasOwn(BinaryOperator.Precedence2, this.token.type)) {
      const operator = this.token;
      this.eat(operator.type);
      const right = this.parsePrimaryExpression();
      left = new BinaryExpression(operator, left, right);
    }

    return left;
  }

  parsePrimaryExpression()
  {
    switch (this.token.type) {
      case TokenType.Identifier: {
        return this.parseIdentifier();
      } break;

      case TokenType.NullLiteral: {
        return this.parseNullLiteral();
      } break;

      case TokenType.BooleanLiteral: {
        return this.parseBooleanLiteral();
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
        throw new Error(`Unexpected token: ${TokenTypeAsString(this.token.type)}`);
      }
    }
  }

  parseIdentifier()
  {
    const value = this.token.value;
    this.eat(TokenType.Identifier);

    return new Identifier(value);
  }

  parseBooleanLiteral()
  {
    const value = Boolean(this.token.value);
    this.eat(TokenType.BooleanLiteral);

    return new BooleanLiteral(value);
  }
  
  parseNullLiteral()
  {
    this.eat(TokenType.NullLiteral);

    return new NullLiteral();
  }

  parseNumericLiteral()
  {
    const value = Number(this.token.value);
    this.eat(TokenType.NumericLiteral);

    return new NumericLiteral(value);
  }

  parseStringLiteral()
  {
    const value = this.token.value;
    this.eat(TokenType.StringLiteral);

    return new StringLiteral(value);
  }

  parseExpression()
  {
    return this.parseBinaryExpression();
  }

  eat(type)
  {
    const tokenType = this.token.type;
    if (type != tokenType) {
      throw new Error(`Expected ${TokenTypeAsString(type)} but got ${TokenTypeAsString(tokenType)}`);
    }

    this.token = this.lexer.nextToken();
  }

  peek(offset = 0)
  {
    return this.lexer.peek(offset);
  }
}