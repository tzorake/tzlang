import { tzDeclareNodeKind, NodeKind, Expression, Statement } from "./base.js";

export class BlockStatement extends Statement
{
  /**
   * @constructor
   * @param {Array<Statement>} body
   */
  constructor(body)
  {
    super(NodeKind.BlockStatement);
    /**
     * @type {Array<Statement>}
     */
    this.body = body;
  }
}
tzDeclareNodeKind(BlockStatement);

export class IfStatement extends Statement
{
  /**
   * @constructor
   * @param {Expression} condition
   * @param {BlockStatement} ifBody
   * @param {BlockStatement} elseBody
   */
  constructor(condition, ifBody, elseBody)
  {
    super(NodeKind.IfStatement);
    /**
     * @type {Expression}
     */
    this.condition = condition;
    /**
     * @type {BlockStatement}
     */
    this.ifBody = ifBody;
    /**
     * @type {BlockStatement}
     */
    this.elseBody = elseBody;
  }
}
tzDeclareNodeKind(IfStatement);

