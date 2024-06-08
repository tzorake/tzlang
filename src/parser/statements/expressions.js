import { TokenKind } from '../token.js';
import { tzDeclareNodeKind, NodeKind, Expression, Statement } from "./base.js";

export class BinaryExpression extends Expression
{
  /**
   * @constructor
   * @param {Token} operator
   * @param {Expression} left
   * @param {Expression} right
   */
  constructor(operator, left, right)
  {
  super(NodeKind.BinaryExpression);
    /**
     * @type {Token}
     */
    this.operator = operator;
    /**
     * @type {Expression}
     */
    this.left = left;
    /**
     * @type {Expression}
     */
    this.right = right;
  }
}
tzDeclareNodeKind(BinaryExpression);

export class UnaryExpression extends Expression
{
  /**
   * @constructor
   * @param {Token} operator
   * @param {Expression} argument
   */
  constructor(operator, argument)
  {
    super(NodeKind.UnaryExpression);
    /**
     * @type {Token}
     */
    this.operator = operator;
    /**
     * @type {Expression}
     */
    this.argument = argument;
  }
}
tzDeclareNodeKind(UnaryExpression);

export class Identifier extends Expression
{
  /**
   * @constructor
   * @param {string} name
   */
  constructor(name)
  {
    super(NodeKind.Identifier);
    /**
     * @type {string}
     */
    this.name = name;
  }
}
tzDeclareNodeKind(Identifier);

export class Literal extends Expression
{
  /**
   * @constructor
   * @param {TokenKind} kind
   * @param {any} value
   */
  constructor(kind, value)
  {
    super(kind);
    /**
     * @type {any}
     */
    this.value = value;
  }
}

export class NumericLiteral extends Literal
{
  /**
   * @constructor
   * @param {number} value
   */
  constructor(value)
  {
    super(NodeKind.NumericLiteral, value);
  }
}
tzDeclareNodeKind(NumericLiteral);

export class StringLiteral extends Literal
{
  /**
   * @constructor
   * @param {string} value
   */
  constructor(value)
  {
    super(NodeKind.StringLiteral, value);
  }
}
tzDeclareNodeKind(StringLiteral);

export class VariableDeclaration extends Expression
{
  /**
   * @constructor
   * @param {string} name
   * @param {Expression | null} value
   */
  constructor(name, value)
  {
    super(NodeKind.VariableDeclaration);
    /**
     * @type {string}
     */
    this.name = name;
    /**
     * @type {Expression | null}
     */
    this.value = value;
  }
}
tzDeclareNodeKind(VariableDeclaration);

export class AssignmentExpression extends Expression
{
  /**
   * @constructor
   * @param {Expression} left
   * @param {Expression} right
   */
  constructor(left, right)
  {
    super(NodeKind.AssignmentExpression);
    /**
     * @type {Expression}
     */
    this.left = left;
    /**
     * @type {Expression}
     */
    this.right = right;
  }
}
tzDeclareNodeKind(AssignmentExpression);