import { NodeKind, NodeKindAsString, Statement, Program, VariableDeclaration, BinaryExpression, NumericLiteral, Identifier } from "../parser/statements.js"
import { TokenType, TokenTypeAsString } from "../parser/token.js"
import { RuntimeValueType, NullValue, NumberValue, RuntimeValue } from "./values.js";
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
      case NodeKind.Program: {
        return this.evaluateProgram(node);
      } break;
      
      case NodeKind.VariableDeclaration: {
        return this.evaluateVariableDeclaration(node);
      } break;

      case NodeKind.BinaryExpression: {
        return this.evaluateBinaryExpression(node);
      } break;

      case NodeKind.AssignmentExpression: {
        return this.evaluateAssignmentExpression(node);
      } break;

      case NodeKind.Identifier: {
        return this.evaluateIdentifier(node);
      } break;

      case NodeKind.NumericLiteral: {
        return this.evaluateNumericLiteral(node);
      } break;

      case NodeKind.StringLiteral: {
        return this.evaluateStringLiteral(node);
      } break;

      default:
        throw new Error(`unsupported node kind: ${NodeKindAsString(node.kind)}`);
    }
  }

  /**
   * @param {Program} node
   * 
   * @returns {RuntimeValue}
   */
  evaluateProgram(node)
  {
    let last = new NullValue();

    for (let statement of node.body) {
      last = this.evaluate(statement);
    }

    return last;
  }

  /**
   * @param {VariableDeclaration} node
   * 
   * @throws {Error}
   * @returns {RuntimeValue}
   */
  evaluateVariableDeclaration(node)
  {
    const value = this.env.define(
      node.identifier, 
      node.value 
        ? this.evaluate(node.value) 
        : new NullValue()
    );

    return value;
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

    if (lhs.type === RuntimeValueType.Number && rhs.type === RuntimeValueType.Number) {
      return this.evaluateNumericBinaryExpression(node.operator, lhs, rhs);
    }

    throw new Error(`unsupported binary expression: ${NodeKindAsString(node.kind)}`);
  }

  /**
   * @param {BinaryExpression} node
   * 
   * @throws {Error}
   * @returns {RuntimeValue}
   */
  evaluateAssignmentExpression(node)
  {
    if (node.left.kind !== NodeKind.Identifier) {
      throw new Error(`unsupported assignment expression: ${NodeKindAsString(node.kind)}`);
    }

    /**
     * @type {Identifier}
     */
    const identifier = node.left;
    const value = this.evaluate(node.right);

    return this.env.assign(identifier.value, value);
  }

  /**
   * @param {Identifier} node
   * 
   * @throws {Error}
   * @returns {RuntimeValue}
   */
  evaluateIdentifier(node)
  {
    return this.env.lookup(node.value);
  }

  /**
   * @param {Token} operator
   * @param {RuntimeValue} lhs
   * @param {RuntimeValue} rhs
   * 
   * @throws {Error}
   * @returns {RuntimeValue}
   */
  evaluateNumericBinaryExpression(operator, lhs, rhs) 
  {
    switch (operator.type) {
      case TokenType.Plus: {
        return this.evaluateNumericBinaryExpression__plus(lhs, rhs);
      } break;

      case TokenType.Asterisk: {
        return this.evaluateNumericBinaryExpression__asterisk(lhs, rhs);
      } break;
    }

    throw new Error(`unsupported binary expression: ${TokenTypeAsString(operator.type)}`);
  }

  /**
   * @param {NumberValue} left
   * @param {NumberValue} right
   * 
   * @returns {NumberValue}
   */
  evaluateNumericBinaryExpression__plus(left, right) 
  {
    const lhs = left.value;
    const rhs = right.value;

    return new NumberValue(lhs + rhs);
  }

  /**
   * @param {NumberValue} left
   * @param {NumberValue} right
   * 
   * @returns {NumberValue}
   */
  evaluateNumericBinaryExpression__asterisk(left, right)
  {
    const lhs = left.value;
    const rhs = right.value;

    return new NumberValue(lhs * rhs);
  }

  /**
   * @param {NumericLiteral} node
   * 
   * @returns {NumberValue}
   */
  evaluateNumericLiteral(node) 
  {
    return new NumberValue(node.value);
  }
}