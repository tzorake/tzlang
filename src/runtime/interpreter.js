import { NodeKind, NodeTypeAsString } from "../parser/statements.js"
import { TokenType, TokenTypeAsString } from "../parser/token.js"
import { RuntimeValueType, NullValue, NumberValue } from "./values.js";

// TODO: pimpl
export class Interpreter
{
  constructor(env)
  {
    this.env = env;
  }

  evaluate(node)
  {
    switch (node.kind) {
      case NodeKind.Program: {
        return this.evaluateProgram(node);
      } break;

      case NodeKind.BinaryExpression: {
        return this.evaluateBinaryExpression(node);
      } break;

      case NodeKind.NumericLiteral: {
        return this.evaluateNumericLiteral(node);
      } break;

      case NodeKind.Identifier: {
        return this.evaluateIdentifier(node);
      } break;

      case NodeKind.StringLiteral: {
        return this.evaluateStringLiteral(node);
      } break;
      
      default:
        throw new Error(`Unsupported node kind: ${NodeTypeAsString[node.kind]}`);
    }
  }

  evaluateProgram(node)
  {
    let last = new NullValue();

    for (let statement of node.body) {
      last = this.evaluate(statement);
    }

    return last;
  }

  evaluateBinaryExpression(node)
  {
    const lhs = this.evaluate(node.left);
    const rhs = this.evaluate(node.right);

    if (lhs.type === RuntimeValueType.Number && rhs.type === RuntimeValueType.Number) {
      return this.evaluateNumericBinaryExpression(node.operator, lhs, rhs);
    }

    throw new Error(`Unsupported binary expression: ${NodeTypeAsString[node.kind]}`);
  }

  evaluateIdentifier(node)
  {
    return this.env.lookup(node.value);
  }

  evaluateNumericBinaryExpression(operator, lhs, rhs) 
  {
    switch (operator.type) {
      case TokenType.Plus: {
        return this.evaluateNumericBinaryExpression__plus(lhs, rhs);
      } break;
    }

    throw new Error(`Unsupported binary expression: ${TokenTypeAsString[operator.type]}`);
  }

  evaluateNumericBinaryExpression__plus(left, right) 
  {
    const lhs = left.value;
    const rhs = right.value;

    return new NumberValue(lhs + rhs);
  }

  evaluateNumericLiteral(node) {
    return new NumberValue(node.value);
  }
}