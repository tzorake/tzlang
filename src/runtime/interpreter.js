import { TokenKind, TokenKindAsString } from "../parser/token.js"
import { NodeKind, NodeKindAsString, Statement } from "../parser/statements/base.js";
import { Identifier, VariableDeclaration, CallExpression, FunctionExpression, BinaryExpression } from "../parser/statements/expressions.js"
import { BlockStatement, IfStatement, ForStatement } from "../parser/statements/statements.js"
import { RuntimeValueKind, RuntimeValue, NullValue, FloatValue, BooleanValue, FunctionValue } from "./values.js";
import { Environment } from "./environment.js";
import { tzNull } from "./macros.js";
import { tzInspectObject, tzLog } from "../parser/macros.js";

export class Interpreter
{
  /**
   * @constructor
   */
  constructor()
  {
  }

  /**
   * @param {Statement} node
   * @param {Environment} env
   * 
   * @returns {RuntimeValue | null}
   */
  evaluate(node, env)
  {
    switch (node.kind) {
      case NodeKind.BlockStatement: {
        return this.evaluateBlockStatement(node, env);
      } break;
      
      case NodeKind.VariableDeclaration: {
        return this.evaluateVariableDeclaration(node, env);
      } break;

      case NodeKind.AssignmentExpression: {
        return this.evaluateAssignmentExpression(node, env);
      } break;

      case NodeKind.IfStatement: {
        return this.evaluateIfStatement(node, env);
      } break;

      case NodeKind.ForStatement: {
        return this.evaluateForStatement(node, env);
      } break;

      case NodeKind.CallExpression: {
        return this.evaluateCallExpression(node, env);
      } break;

      case NodeKind.FunctionExpression: {
        return this.evaluateFunctionExpression(node, env);
      } break;

      case NodeKind.BinaryExpression: {
        return this.evaluateBinaryExpression(node, env);
      } break;

      case NodeKind.Identifier: {
        return this.evaluateIdentifier(node, env);
      } break;

      case NodeKind.NumericLiteral: {
        return this.evaluateNumericLiteral(node);
      } break;
    }

    throw new Error(`unsupported node kind: ${NodeKindAsString(node.kind)}`);
  }

  /**
   * @param {BlockStatement} node
   * @param {Environment} env
   * 
   * @returns {RuntimeValue}
   */
  evaluateBlockStatement(node, env)
  {
    const scope = new Environment(env);

    let last = new NullValue();
    for (let statement of node.body) {
      last = this.evaluate(
        statement,
        scope
      );
    }

    return last;
  }

  /**
   * @param {VariableDeclaration} node
   * @param {Environment} env
   * 
   * @returns {RuntimeValue}
   */
  evaluateVariableDeclaration(node, env)
  {
    const value = node.value 
      ? this.evaluate(node.value, env) 
      : new NullValue();
    env.define(node.name, value);

    return value;
  }

  
  /**
   * @param {AssignmentExpression} node
   * @param {Environment} env
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
    const value = this.evaluate(node.right, env);

    return env.assign(identifier.name, value);
  }

  /**
   * @param {IfStatement} node
   * @param {Environment} env
   * 
   * @throws {Error}
   * @returns {void}
   */
  evaluateIfStatement(node, env)
  {
    const result = this.evaluate(
      node.condition, 
      new Environment(env)
    );
    if (result.kind === RuntimeValueKind.Boolean) {
      return result.value 
        ? this.evaluate(
            node.ifBody, 
            new Environment(env)
          )
        : node.elseBody 
          ? this.evaluate(
              node.elseBody, 
              new Environment(env)
            ) 
          : tzNull();
    }

    throw new Error(`condition must be boolean: ${node.condition}`);
  }

  /**
   * @param {ForStatement} node
   * @param {Environment} env
   * 
   * @throws {Error}
   * @returns {void}
   */
  evaluateForStatement(node, env)
  {
    let condition = this.evaluate(
      node.condition, 
      new Environment(env)
    );
    if (condition.kind !== RuntimeValueKind.Boolean) {
      throw new Error(`condition must be boolean: ${node.condition}`);
    }

    while (condition.value) {
      this.evaluate(
        node.body, 
        new Environment(env)
      );
      condition = this.evaluate(
        node.condition, 
        new Environment(env)
      )
    }

    return tzNull();
  }

  /**
   * @param {CallExpression} node
   * @param {Environment} env
   * 
   * @throws {Error}
   * @returns {RuntimeValue}
   */
  evaluateCallExpression(node, env)
  {
    const callee = this.evaluate(node.callee, env);
    const values = node.args.map(arg => this.evaluate(arg, env));

    if (callee.kind === RuntimeValueKind.NativeFunction) {
      return callee.fn(values, callee.env);
    }

    if (callee.kind === RuntimeValueKind.Function) {
      const args = callee.args;
      const scope = new Environment(callee.env);
      args.forEach((arg, idx) => {
        scope.define(arg.name, values[idx] ?? tzNull());
      });

      return this.evaluate(callee.body, scope);
    }

    throw new Error(`callee must be function: ${node.callee}`);
  }

  /**
   * @param {FunctionExpression} node
   * @param {Environment} env
   * 
   * @throws {Error}
   * @returns {RuntimeValue}
   */
  evaluateFunctionExpression(node, env)
  {
    const args = node.args;
    const body = node.body;

    return new FunctionValue(args, body, env);
  }

  /**
   * @param {BinaryExpression} node
   * @param {Environment} env
   * 
   * @throws {Error}
   * @returns {RuntimeValue}
   */
  evaluateBinaryExpression(node, env)
  {
    const lhs = this.evaluate(node.left, env);
    const rhs = this.evaluate(node.right, env);

    if (lhs.kind === RuntimeValueKind.Float && rhs.kind === RuntimeValueKind.Float) {
      return this.evaluateNumericBinaryExpression(node.operator, lhs, rhs);
    }

    if (lhs.kind === RuntimeValueKind.Boolean && rhs.kind === RuntimeValueKind.Boolean) {
      return this.evaluateBooleanBinaryExpression(node.operator, lhs, rhs);
    }

    throw new Error(`unsupported binary expression: ${NodeKindAsString(node.kind)}`);
  }

  /**
   * @param {Identifier} node
   * @param {Environment} env
   * 
   * @throws {Error}
   * @returns {RuntimeValue}
   */
  evaluateIdentifier(node, env)
  {
    return env.lookup(node.name);
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
