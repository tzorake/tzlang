import { TokenType, TokenTypeAsString } from './token.js';
import { Program, Identifier, NumericLiteral, StringLiteral, BinaryExpression, BinaryOperator, Precedence, Keyword, VariableDeclaration, NodeKind } from './statements.js';

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

    switch (this.token.type) {
      case TokenType.Identifier: {
        if (this.token.value === Keyword.Let) {
          return this.parseVariableDeclaration();
        }
      } break;
    }

    return this.parseExpression();
  }

  parseExpression()
  {
    return this.parseBinaryExpression();
  }

  parseBinaryExpression()
  {
    return this.parseBinaryExpression__precedence_3();
  }

  parseBinaryExpression__precedence_3()
  {
  //   let left = this.parseBinaryExpression__precedence_2();
  //   while (Object.hasOwn(BinaryOperator[Precedence.Precedence3], this.token.type)) {
  //     const operator = this.token;
  //     this.eat(operator.type);
  //     const right = this.parseBinaryExpression__precedence_3();
  //     left = new AssignmentExpression(operator, left, right);
  //   }

  //   return left;
    return this.parseBinaryExpressionWithPrecedence(
      Precedence.Precedence3, 
      () => this.parseBinaryExpression__precedence_2(),
      () => this.parseBinaryExpression__precedence_3(),
      NodeKind.AssignmentExpression
    );
  }

  parseBinaryExpression__precedence_2()
  {
    return this.parseBinaryExpressionWithPrecedence(
      Precedence.Precedence2, 
      () => this.parseBinaryExpression__precedence_1(),
      () => this.parseBinaryExpression__precedence_1(),
      NodeKind.BinaryExpression
    );
  }

  parseBinaryExpression__precedence_1()
  {
    return this.parseBinaryExpressionWithPrecedence(
      Precedence.Precedence1, 
      () => this.parsePrimaryExpression(),
      () => this.parsePrimaryExpression(),
      NodeKind.BinaryExpression
    );
  }

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

  parseVariableDeclaration()
  {
    // [] - optional
    // let name[ = expression]
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

  eat(type)
  {
    const tokenType = this.token.type;
    if (type != tokenType) {
      throw new Error(`expected ${TokenTypeAsString(type)} but got ${TokenTypeAsString(tokenType)}`);
    }

    this.token = this.lexer.nextToken();
  }

  peek(offset = 0)
  {
    return this.lexer.peek(offset);
  }
}