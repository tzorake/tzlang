import { escape } from "./utils.js"

/**
 * @param {number}
 */
let iota = 0;
/**
 * @readonly
 * @enum {number}
 */
export const TokenKind = {
  Identifier          : iota++,
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

/**
 * @param {TokenKind} type 
 * 
 * @returns {string | undefined}
 */
export function TokenKindAsString(type)
{
  return Object.keys(TokenKind).find(key => TokenKind[key] === type);
}

iota = 0;
/**
 * @readonly
 * @enum {number}
 */
export const NumericLiteralType = {
  Integer    : iota++,
  Real       : iota++,
};

iota = 0;
/**
 * @readonly
 * @enum {number}
 */
export const IntegerLiteralKind = {
  Regular    : iota++,
  Binary     : iota++,
  Hex        : iota++,
};

iota = 0;
/**
 * @readonly
 * @enum {number}
 */
export const RealLiteralKind = {
  Regular    : iota++,
  Scientific : iota++,
};

export class Specialization 
{
  /**
   * @constructor
   * @param {NumericLiteralType} type
   * @param {IntegerLiteralKind | RealLiteralKind} kind
   */
  constructor(type, kind)
  {
    /**
     * @type {NumericLiteralType}
     */
    this.type = type;
    /**
     * @type {IntegerLiteralKind | RealLiteralKind}
     */
    this.kind = kind;
  }

  /**
   * @returns {string}
   */
  toString()
  {
    return `<Specialization type='${this.type}' kind='${this.kind}'>`;
  }
}

export class Token 
{
  /**
   * @constructor
   * @param {string} value
   * @param {TokenKind} type
   */
  constructor(value, type)
  {
    /**
     * @type {string}
     */
    this.value = value;
    /**
     * @type {TokenKind}
     */
    this.type = type;
  }

  /**
   * @returns {string}
   */
  toString()
  {
    const value = this.type === TokenKind.NewLine ? escape(this.value) : this.value;
    return `<Token value='${value}' type='${TokenKindAsString(this.type)}'>`;
  }
}

export class TokenWithSpecialization extends Token 
{
  /**
   * @constructor
   * @param {string} value
   * @param {TokenKind} type
   * @param {Specialization} specialization
   */
  constructor(value, type, specialization) 
  {
    super(value, type);
    /**
     * @type {Specialization}
     */
    this.specialization = specialization;
  }

  /**
   * @returns {string}
   */
  toString() 
  {
    const value = this.type === TokenKind.NewLine ? escape(this.value) : this.value;
    return `<Token value='${value}' type='${TokenKindAsString(this.type)}' specialization='${this.specialization}'>`;
  }
}