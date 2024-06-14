import { TokenKind, TokenKindAsString } from "../parser/token.js"
import { NodeKind, NodeKindAsString, Statement } from "../parser/statements/base.js";
import { Identifier, VariableDeclaration } from "../parser/statements/expressions.js"
import { BlockStatement, IfStatement, ForStatement } from "../parser/statements/statements.js"
import { RuntimeValueType, RuntimeValue, NullValue, FloatValue, BooleanValue } from "./values.js";
import { Environment } from "./environment.js";
import { tzNull } from "./macros.js";

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
   * @returns {RuntimeValue | null}
   */
  evaluate(node)
  {
    switch (node.kind) {
      case NodeKind.BlockStatement: {
        return this.evaluateBlockStatement(node);
      } break;
      
      case NodeKind.VariableDeclaration: {
        return this.evaluateVariableDeclaration(node);
      } break;

      case NodeKind.AssignmentExpression: {
        return this.evaluateAssignmentExpression(node);
      } break;

      case NodeKind.IfStatement: {
        return this.evaluateIfStatement(node);
      } break;

      case NodeKind.ForStatement: {
        return this.evaluateForStatement(node);
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
   * @param {VariableDeclaration} node
   * 
   * @returns {RuntimeValue}
   */
  evaluateVariableDeclaration(node)
  {
    const value = node.value ? this.evaluate(node.value) : new NullValue();
    this.env.define(node.name, value);

    return value;
  }

  
  /**
   * @param {AssignmentExpression} node
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

    return this.env.assign(identifier.name, value);
  }

  /**
   * @param {IfStatement} node
   * 
   * @throws {Error}
   * @returns {void}
   */
  evaluateIfStatement(node)
  {
    const result = this.evaluate(node.condition);
    if (result.type === RuntimeValueType.Boolean) {
      return result.value 
        ? this.evaluate(node.ifBody)
        : node.elseBody 
          ? this.evaluate(node.elseBody) 
          : tzNull();
    }

    throw new Error(`condition must be boolean: ${node.condition}`);
  }

    /**
   * @param {ForStatement} node
   * 
   * @throws {Error}
   * @returns {void}
   */
    evaluateForStatement(node)
    {
      let condition = this.evaluate(node.condition);
      if (condition.type !== RuntimeValueType.Boolean) {
        throw new Error(`condition must be boolean: ${node.condition}`);
      }

      while (condition.value) {
        this.evaluate(node.body);
        condition = this.evaluate(node.condition)
      }

      return tzNull();
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

    if (lhs.type === RuntimeValueType.Boolean && rhs.type === RuntimeValueType.Boolean) {
      return this.evaluateBooleanBinaryExpression(node.operator, lhs, rhs);
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

      case TokenKind.LessThan: {
        return new BooleanValue(left.value < right.value);
      } break;

      case TokenKind.GreaterThan: {
        return new BooleanValue(left.value > right.value);
      } break;

      case TokenKind.LessThanEqual: {
        return new BooleanValue(left.value <= right.value);
      } break;

      case TokenKind.GreaterThanEqual: {
        return new BooleanValue(left.value >= right.value);
      } break;
    }

    throw new Error(`unsupported binary expression: ${TokenKindAsString(operator.type)}`);
  }

  evaluateBooleanBinaryExpression(operator, left, right) 
  {
    throw new Error(`unsupported binary expression: ${TokenKindAsString(operator.type)}`);
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