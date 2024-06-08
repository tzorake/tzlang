import { isclass } from "../../parser/utils.js";

/**
 * @param {number}
 */
let iota = 0;
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

/**
 * @param {any} className 
 * 
 * @returns {void}
 */
export function TZ_DECLARE_NODE_KIND(className)
{
  if (isclass(className)) {
    NodeKind[className.name] = iota++;
  }
}

/**
 * @returns {void}
 */
export function TZ_NOT_IMPLEMENTED()
{
  throw new Error("not implemented!");
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
