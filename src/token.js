import { escape } from "./utils.js"

let iota = 0;
export const TokenType = {
  Identifier          : iota++,

  NullLiteral         : iota++,
  BooleanLiteral      : iota++,
  NumericLiteral      : iota++,
  StringLiteral       : iota++,

  OpenParen           : iota++,
  CloseParen          : iota++,
  OpenCurly           : iota++,
  CloseCurly          : iota++,

  Colon               : iota++,
  NewLine             : iota++,
  Semicolon           : iota++,
  Comma               : iota++,
  Dot                 : iota++,

  Apostrophe          : iota++,
  QuotationMark       : iota++,
  GraveAccent         : iota++,

  Plus                : iota++,
  DoublePlus          : iota++,
  Minus               : iota++,
  DoubleMinus         : iota++,
  Asterisk            : iota++,
  Slash               : iota++,
  Percent             : iota++,
  NotEqual            : iota++,
  DoubleEqual         : iota++,
  Equal               : iota++,
  Arrow               : iota++,
  LessThan            : iota++,
  GreaterThan         : iota++,
  Ampersand           : iota++,
  DoubleAmpersand     : iota++,
  Bar                 : iota++,
  DoubleBar           : iota++,

  Eof                 : iota++,
};

export function TokenTypeAsString(type) {
  return Object.keys(TokenType).find(key => TokenType[key] === type);
}

iota = 0;
export const IntegerLiteralKind = {
  Regular    : iota++,
  Binary     : iota++,
  Hex        : iota++,
};

iota = 0;
export const RealLiteralKind = {
  Regular    : iota++,
  Scientific : iota++,
};

iota = 0;
export const NumericLiteralType = {
  Integer : iota++,
  Real    : iota++,
};

export class Specialization {
  constructor(type, kind) {
    this.type = type;
    this.kind = kind;
  }
}

export class Token {
  constructor(value, type, specialization = null) {
    this.value = value;
    this.type = type;
    this.specialization = specialization;
  }

  toString() {
    const value = this.type === TokenType.NewLine ? escape(this.value) : this.value;
    return `<Token value='${value}' type='${TokenTypeAsString(this.type)}'>`;
  }
}