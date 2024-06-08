import { TZ_DECLARE_NODE_KIND } from '../macros.js';

/**
 * @enum {number}
 */
export const NodeKind = {};

/**
 * @param {NodeKind} type 
 * 
 * @returns {string | undefined}
 */
export function NodeKindAsString(kind) 
{
  return Object.keys(NodeKind).find(key => NodeKind[key] === kind);
}

export class Statement 
{
  /**
   * @constructor
   * @param {NodeKind} kind
   */
  constructor(kind)
  {
    /**
     * @type {NodeKind}
     */
    this.kind = kind;
  }
}
TZ_DECLARE_NODE_KIND(Statement);

export class BlockStatement extends Statement
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
