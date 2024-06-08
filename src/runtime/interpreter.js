import { NodeKind, NodeKindAsString, Statement, BlockStatement } from "../parser/statements/statements.js"
import { Identifier } from "../parser/statements/expressions.js"
import { TokenKind } from "../parser/token.js"
import { RuntimeValueType, RuntimeValue, NullValue, FloatValue, BooleanValue } from "./values.js";
import { Environment } from "./environment.js";

export class Interpreter
{
  /**
   * @constructor
   * @param {Environment} env
   */
  constructor(env)
  {
    /**
     * @type {Environment}
     */
    this.env = env;
  }

  /**
   * @param {Statement} node
   * 
   * @returns {RuntimeValue}
   */
  evaluate(node)
  {
    switch (node.kind) {
      case NodeKind.BlockStatement: {
        return this.evaluateBlockStatement(node);
      } break;
      
      case NodeKind.BinaryExpression: {
        return this.evaluateBinaryExpression(node);
      } break;

      case NodeKind.Identifier: {
        return this.evaluateIdentifier(node);
      } break;

      case NodeKind.NumericLiteral: {
        return this.evaluateNumericLiteral(node);
      } break;
    }

    throw new Error(`unsupported node kind: ${NodeKindAsString(node.kind)}`);
  }

  /**
   * @param {BlockStatement} node
   * 
   * @returns {RuntimeValue}
   */
  evaluateBlockStatement(node)
  {
    let last = new NullValue();

    for (let statement of node.body) {
      last = this.evaluate(statement);
    }

    return last;
  }

  /**
   * @param {BinaryExpression} node
   * 
   * @throws {Error}
   * @returns {RuntimeValue}
   */
  evaluateBinaryExpression(node)
  {
    const lhs = this.evaluate(node.left);
    const rhs = this.evaluate(node.right);

    if (lhs.type === RuntimeValueType.Float && rhs.type === RuntimeValueType.Float) {
      return this.evaluateNumericBinaryExpression(node.operator, lhs, rhs);
    }

    throw new Error(`unsupported binary expression: ${NodeKindAsString(node.kind)}`);
  }

  /**
   * @param {Identifier} node
   * 
   * @throws {Error}
   * @returns {RuntimeValue}
   */
  evaluateIdentifier(node)
  {
    return this.env.lookup(node.name);
  }

  /**
   * @param {Token} operator
   * @param {FloatValue} left
   * @param {FloatValue} right
   * 
   * @throws {Error}
   * @returns {FloatValue}
   */
  evaluateNumericBinaryExpression(operator, left, right) 
  {
    switch (operator.type) {
      case TokenKind.Plus: {
        return new FloatValue(left.value + right.value);
      } break;

      case TokenKind.Minus: {
        return new FloatValue(left.value - right.value);
      } break;

      case TokenKind.Asterisk: {
        return new FloatValue(left.value * right.value);
      } break;

      case TokenKind.Slash: {
        return new FloatValue(left.value / right.value);
      } break;
    }

    throw new Error(`unsupported binary expression: ${TokenTypeAsString(operator.type)}`);
  }

  /**
   * @param {NumericLiteral} node
   * 
   * @returns {FloatValue}
   */
  evaluateNumericLiteral(node) 
  {
    const value = parseFloat(node.value);

    return new FloatValue(value);
  }
}