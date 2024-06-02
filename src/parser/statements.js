import { TokenType } from "./token.js";

let iota = 0;
export const NodeKind = {
  Program              : iota++,
  Statement            : iota++,

  Identifier           : iota++,
  NumericLiteral       : iota++,
  StringLiteral        : iota++,

  VariableDeclaration  : iota++,
  BinaryExpression     : iota++,
  AssignmentExpression : iota++,
};

export function NodeKindAsString(type) 
{
  return Object.keys(NodeKind).find(key => NodeKind[key] === type);
}

export const Keyword = {
  Let    : "let",
  Return : "return",
  If     : "if",
  Else   : "else",
  For    : "for",
};

const BinaryOperator__precedence_1 = {
  [TokenType.Asterisk]    : "*",
  [TokenType.Slash]       : "/",
};

const BinaryOperator__precedence_2 = {
  [TokenType.Plus]        : "+",
  [TokenType.Minus]       : "-",
};

const BinaryOperator__precedence_3 = {
  [TokenType.Equal]       : "=",
};

iota = 0;
export const Precedence = {
  Precedence1         : iota++,
  Precedence2         : iota++,
  Precedence3         : iota++,
};

export const BinaryOperator = {
  [Precedence.Precedence1]: BinaryOperator__precedence_1,
  [Precedence.Precedence2]: BinaryOperator__precedence_2,
  [Precedence.Precedence3]: BinaryOperator__precedence_3,
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
  constructor(operator, left, right, kind = NodeKind.BinaryExpression) 
  {
    super(kind);
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

export class VariableDeclaration extends Expression 
{
  constructor(identifier, value = null) 
  {
    super(NodeKind.VariableDeclaration);
    this.identifier = identifier;
    this.value = value;
  }
}
