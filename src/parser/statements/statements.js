import { Token, TokenKind } from "../token.js";
import { isclass } from "../../parser/utils.js";

/**
 * @param {number}
 */
let iota = 0;
/**
 * @enum {number}
 */
export const NodeKind = {
  // Statement            : iota++,
  // BlockStatement       : iota++,

  // Identifier           : iota++,
  // NumericLiteral       : iota++,
  // StringLiteral        : iota++,

  // VariableDeclaration  : iota++,
  // BinaryExpression     : iota++,
  // AssignmentExpression : iota++,
};

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
