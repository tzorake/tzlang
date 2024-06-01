import { TokenType } from "./token.js";

let iota = 0;
export const NodeKind = {
  Program             : iota++,
  Statement           : iota++,
  BinaryExpression    : iota++,

  Identifier          : iota++,
  NumericLiteral      : iota++,
  StringLiteral       : iota++,
};

export function NodeTypeAsString(type) 
{
  return Object.keys(NodeKind).find(key => NodeKind[key] === type);
}

export const Keyword = {
  Let    : "let",
  Return : "return",
  If     : "if",
  Else   : "else",
  For    : "for",
}

const BinaryOperator__precedence_1 = {
  [TokenType.Plus]    : "+",
  [TokenType.Minus]   : "-",
};

const BinaryOperator__precedence_2 = {
  [TokenType.Asterisk] : "*",
  [TokenType.Slash]    : "/",
};

export const BinaryOperator = {
  Precedence1: BinaryOperator__precedence_1,
  Precedence2: BinaryOperator__precedence_2,
};

export class Statement 
{
  constructor(kind)
  {
    this.kind = kind;
  }
}

export class Program extends Statement 
{
  constructor(body)
  {
    super(NodeKind.Program);
    this.body = body;
  }
}

export class Expression extends Statement 
{
  constructor(kind)
  {
    super(kind);
  }
}

export class BinaryExpression extends Expression 
{
  constructor(operator, left, right) 
  {
    super(NodeKind.BinaryExpression);
    this.operator = operator;
    this.left = left;
    this.right = right;
  }
}

export class Identifier extends Expression 
{
  constructor(value) 
  {
    super(NodeKind.Identifier);
    this.value = value;
  }
}

export class NullLiteral extends Expression 
{
  constructor() 
  {
    super(NodeKind.NullLiteral);
    this.value = null;
  }
}

export class BooleanLiteral extends Expression 
{
  constructor(value) 
  {
    super(NodeKind.BooleanLiteral);
    this.value = value;
  }
}

export class NumericLiteral extends Expression 
{
  constructor(value) 
  {
    super(NodeKind.NumericLiteral);
    this.value = value;
  }
}

export class StringLiteral extends Expression 
{
  constructor(value) 
  {
    super(NodeKind.StringLiteral);
    this.value = value;
  }
}