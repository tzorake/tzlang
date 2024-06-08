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
  OpenBracket         : iota++,
  CloseBracket        : iota++,

  Apostrophe          : iota++,
  QuotationMark       : iota++,
  GraveAccent         : iota++,
  
  Plus                : iota++,
  Minus               : iota++,
  Asterisk            : iota++,
  Slash               : iota++,
  Percent             : iota++,
  Ampersand           : iota++,
  Bar                 : iota++,
  Equal               : iota++,
  LessThan            : iota++,
  GreaterThan         : iota++,
  Tilde               : iota++,
  Hash                : iota++,
  ExclamationMark     : iota++,
  QuestionMark        : iota++,
  Colon               : iota++,
  Semicolon           : iota++,
  Comma               : iota++,
  Dot                 : iota++,

  Eol                 : iota++,
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
}

export class Token 
{
  /**
   * @constructor
   * @param {TokenKind} type
   * @param {string} value
   * @param {number} precedence
   */
  constructor(type, value, precedence = 0)
  {
    /**
     * @type {TokenKind}
     */
    this.type = type;
    /**
     * @type {string}
     */
    this.value = value;
    /**
     * @type {number}
     */
    this.precedence = precedence;
  }
}

export class TokenWithSpecialization extends Token 
{
  /**
   * @constructor
   * @param {TokenKind} type
   * @param {string} value
   * @param {number} precedence
   * @param {Specialization} specialization
   */
  constructor(type, value, precedence, specialization) 
  {
    super(type, value, precedence);
    /**
     * @type {Specialization}
     */
    this.specialization = specialization;
  }
}