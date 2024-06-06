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