import { isclass } from "../utils.js";

/**
 * @enum {number}
 */
export const NodeKind = {};

/**
 * @param {number}
 */
let iota = 0;

/**
 * @param {any} className 
 * 
 * @returns {void}
 */
export function tzDeclareNodeKind(className)
{
  if (isclass(className)) {
    NodeKind[className.name] = iota++;
  }
}

/**
 * @param {NodeKind} type 
 * 
 * @returns {string | undefined}
 */
export function NodeKindAsString(kind) 
{
  return Object.keys(NodeKind).find(key => NodeKind[key] === kind);
}

export class Expression
{
  /**
   * @constructor
   * @param {NodeKind} kind
   */
  constructor(kind)
  {
    this.kind = kind;
  }
}

export class Statement extends Expression
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
    super(kind);
  }
}
tzDeclareNodeKind(Statement);
