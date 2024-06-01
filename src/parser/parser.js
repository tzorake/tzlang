import { TokenType, TokenTypeAsString } from './token.js';
import { Program, Identifier, NumericLiteral, StringLiteral, BinaryExpression, BinaryOperator, Precedence } from './statements.js';

export class Parser 
{
  constructor(lexer, env) 
  {
    this.lexer = lexer;
    this.token = this.lexer.nextToken();
    this.env = env;
  }

  reset()
  {
    this.lexer.reset();
    this.token = this.lexer.nextToken();
    this.env.reset();
  }

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

  parseStatement()
  {
    while (this.token.type === TokenType.NewLine) {
      this.eat(TokenType.NewLine);
    }

    if (this.token.type === TokenType.Eof) {
      return null;
    }

    return this.parseExpression();
  }

  parseBinaryExpression()
  {
    return this.parseBinaryExpression__precedence_2();
  }

  parseBinaryExpression__precedence_2()
  {
    return this.parseBinaryExpressionWithPrecedence(
      Precedence.Precedence2, 
      () => this.parseBinaryExpression__precedence_1()
    );
  }

  parseBinaryExpression__precedence_1()
  {
    return this.parseBinaryExpressionWithPrecedence(
      Precedence.Precedence1, 
      () => this.parsePrimaryExpression()
    );
  }

  parseBinaryExpressionWithPrecedence(precedence, lowerPrecedenceConsumer)
  {
    let left = lowerPrecedenceConsumer();
    while (Object.hasOwn(BinaryOperator[precedence], this.token.type)) {
      const operator = this.token;
      this.eat(operator.type);
      const right = lowerPrecedenceConsumer();
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