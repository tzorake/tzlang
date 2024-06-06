import { Token, TokenType } from "./token.js";

/**
 * @param {number}
 */
let iota = 0;
/**
 * @readonly
 * @enum {number}
 */
export const NodeKind = {
  Statement            : iota++,
  BlockStatement       : iota++,

  Identifier           : iota++,
  NumericLiteral       : iota++,
  StringLiteral        : iota++,

  VariableDeclaration  : iota++,
  BinaryExpression     : iota++,
  AssignmentExpression : iota++,
};

/**
 * @param {NodeKind} type 
 * @returns {string | undefined}
 */
export function NodeKindAsString(kind) 
{
  return Object.keys(NodeKind).find(key => NodeKind[key] === kind);
}

/**
 * @readonly
 * @enum {string}
 */
export const Keyword = {
  Let    : "let",
  Return : "return",
  If     : "if",
  Else   : "else",
  For    : "for",
};


/**
 * @readonly
 * @enum {string}
 */
const BinaryOperator__precedence_1 = {
  [TokenType.Asterisk]    : "*",
  [TokenType.Slash]       : "/",
};

/**
 * @readonly
 * @enum {string}
 */
const BinaryOperator__precedence_2 = {
  [TokenType.Plus]        : "+",
  [TokenType.Minus]       : "-",
};

/**
 * @readonly
 * @enum {string}
 */
const BinaryOperator__precedence_3 = {
  [TokenType.Equal]       : "=",
};

iota = 0;
/**
 * @readonly
 * @enum {number}
 */
export const Precedence = {
  Precedence1         : iota++,
  Precedence2         : iota++,
  Precedence3         : iota++,
};

/**
 * @readonly
 * @enum {Object}
 */
export const BinaryOperator = {
  [Precedence.Precedence1]: BinaryOperator__precedence_1,
  [Precedence.Precedence2]: BinaryOperator__precedence_2,
  [Precedence.Precedence3]: BinaryOperator__precedence_3,
};

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

export class BlockExpression extends Expression 
{
  /**
   * @constructor
   * @param {Array<Statement>} body
   */
  constructor(body)
  {
    super(NodeKind.BlockExpression);
    /**
     * @type {Array<Statement>}
     */
    this.body = body;
  }
}

export class BinaryExpression extends Expression 
{
  /**
   * @constructor
   * @param {Token} operator
   * @param {Expression} left
   * @param {Expression} right
   * @param {NodeKind} kind
   */
  constructor(operator, left, right, kind = NodeKind.BinaryExpression) 
  {
    super(kind);
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

export class Identifier extends Expression 
{
  /**
   * @constructor
   * @param {string} value
   */
  constructor(value) 
  {
    super(NodeKind.Identifier);
    /**
     * @type {string}
     */
    this.value = value;
  }
}

export class NullLiteral extends Expression 
{
  constructor() 
  {
    super(NodeKind.NullLiteral);
    /**
     * @type {null}
     */
    this.value = null;
  }
}

export class BooleanLiteral extends Expression 
{
  /**
   * @constructor
   * @param {boolean} value
   */
  constructor(value) 
  {
    super(NodeKind.BooleanLiteral);
    /**
     * @type {boolean}
     */
    this.value = value;
  }
}

export class NumericLiteral extends Expression 
{
  /**
   * @constructor
   * @param {number} value
   */
  constructor(value) 
  {
    super(NodeKind.NumericLiteral);
    /**
     * @type {number}
     */
    this.value = value;
  }
}

export class StringLiteral extends Expression 
{
  /**
   * @constructor
   * @param {string} value
   */
  constructor(value) 
  {
    super(NodeKind.StringLiteral);
    /**
     * @type {string}
     */
    this.value = value;
  }
}

export class VariableDeclaration extends Expression 
{
  /**
   * @constructor
   * @param {string} identifier
   * @param {Expression | null} value
   */
  constructor(identifier, value = null) 
  {
    super(NodeKind.VariableDeclaration);
    /**
     * @type {string}
     */
    this.identifier = identifier;
    /**
     * @type {Expression | null}
     */
    this.value = value;
  }
}
