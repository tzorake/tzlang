import { TokenKind } from '../token.js';
import { TZ_DECLARE_NODE_KIND, NodeKind, Statement } from './statements.js';

export class Expression extends Statement 
{
  /**
   * @constructor
   * @param {NodeKind} kind
   */
  constructor(kind)
  {
    super(kind);
  }
}

export class BlockStatement extends Expression
{
  /**
   * @constructor
   * @param {NodeKind} kind
   */
  constructor(body)
  {
    super(NodeKind.BlockStatement);
    this.body = body;
  }
}
TZ_DECLARE_NODE_KIND(BlockStatement);

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
    this.operator = operator;
    this.left = left;
    this.right = right;
  }
}
TZ_DECLARE_NODE_KIND(BinaryExpression);

export class UnaryExpression extends Expression
{
  /**
   * @constructor
   * @param {TokenKind} operator
   * @param {Expression} argument
   */
  constructor(operator, argument)
  {
    super(NodeKind.UnaryExpression);
    this.operator = operator;
    this.argument = argument;
  }
}
TZ_DECLARE_NODE_KIND(UnaryExpression);

export class Identifier extends Expression
{
  /**
   * @constructor
   * @param {string} name
   */
  constructor(name)
  {
    super(NodeKind.Identifier);
    this.name = name;
  }
}
TZ_DECLARE_NODE_KIND(Identifier);

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
TZ_DECLARE_NODE_KIND(NumericLiteral);

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
TZ_DECLARE_NODE_KIND(StringLiteral);