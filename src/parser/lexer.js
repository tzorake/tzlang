import { isdigit, isalpha, isalnum, isbinary, ishex, isstrterm, escape } from "./utils.js"
import { Token, TokenWithSpecialization, TokenKind, Specialization, NumericLiteralType, IntegerLiteralKind, RealLiteralKind } from './token.js';

export class Lexer
{
  /**
   * @constructor
   * @param {string} source
   */
  constructor(source)
  {
    /**
     * @type {string}
     */
    this.source = source;
    /**
     * @type {number}
     */
    this.size = source.length;

    /**
     * @type {number}
     */
    this.index = 0;
    /**
     * @type {string}
     */
    this.char = this.source[this.index];
    /**
     * @type {boolean}
     */
    this.exhasted = false;
  }

  /**
   * @returns {string}
   */
  toString()
  {
    const source = escape(this.source);
    return `<Lexer source='${source}' index=${this.index} char='${this.char}' exhasted=${this.exhasted}/>`;
  }

  /**
   * @returns {void}
   */
  reset()
  {
    this.index = 0;
    this.char = this.source[this.index];
    this.exhasted = false;
  }

  /**
   * @param {string} value
   * @param {TokenKind} type
   * @param {Specialization} specialization
   * 
   * @returns {Token}
   */
  token(value, type, specialization = null)
  {
    return specialization 
      ? new TokenWithSpecialization(value, type, specialization) 
      : new Token(value, type);
  }

  /**
   * @returns {void}
   */
  advance()
  {
    if (this.index < this.size && this.char != undefined) {
      this.index++;
      this.char = this.source[this.index];
    }
  }

  /**
   * @param {Token} token
   * 
   * @returns {Token}
   */
  advanceWith(token)
  {
    this.advance();
    
    return token;
  }

  /**
   * @param {number} offset
   * 
   * @returns {string}
   */
  peek(offset = 0)
  {
    return this.source[this.index + offset];
  }

  /**
   * @param {number} [offset=0]
   * @param {string} char
   * 
   * @returns {boolean}
   */
  checkedPeek(offset = 0, char)
  {
    if (this.index + offset >= this.size) {
      return false;
    }

    return this.peek(offset) === char;
  }

  /**
   * @param {TokenKind} type
   * 
   * @returns {Token}
   */
  advanceCurrent(type)
  {
    const value = this.char;
    this.advance();
    
    return this.token(value, type);
  }

  /**
   * @returns {Token}
   */
  lexIdentifier()
  {
    let value = "";
    do {
      value += this.char;
      this.advance();
    } while (isalnum(this.char));

    return this.token(value, TokenKind.Identifier);
  }

  /**
   * @throws {Error}
   * @returns {Token}
   */
  lexNumber()
  {
    if (this.checkedPeek(0, "0")) {
      if (this.checkedPeek(1, "x")) {
        return this.lexHex();
      }

      if (this.checkedPeek(1, "b")) {
        return this.lexBinary();
      }

      throw new Error("invalid number");
    }

    let value = "";

    do {
      value += this.char;
      this.advance();
    } while (isdigit(this.char));

    let isFloat = false;
    let isScientific = false;

    if (this.char === ".") {
      isFloat = true;
      isScientific = false;

      value += this.char;
      this.advance();

      do {
        value += this.char;
        this.advance();
      } while (isdigit(this.char));
    }

    if (this.char === "e" || this.char === "E") {
      isFloat = true;
      isScientific = true;

      value += this.char;
      this.advance();
      if (this.char === "+" || this.char === "-") {
        value += this.char;
        this.advance();
      }
      
      do {
        value += this.char;
        this.advance();
      } while (isdigit(this.char));
    }

    return this.token(
      value, 
      TokenKind.NumericLiteral, 
      new Specialization(
        isFloat ? NumericLiteralType.Real : NumericLiteralType.Integer,
        isFloat ? (isScientific ? RealLiteralKind.Regular : RealLiteralKind.Scientific)
                : IntegerLiteralKind.Regular
      )
    );
  }

  /**
   * @throws {Error}
   * @returns {Token}
   */
  lexHex()
  {
    let value = "0x";
    this.advance();
    this.advance();

    if (!ishex(this.char)) {
      throw new Error("unexpected digit after 0x");
    }

    do {
      value += this.char;
      this.advance();
    } while (ishex(this.char));

    return this.token(
      value, 
      TokenKind.NumericLiteral, 
      new Specialization(
        NumericLiteralType.Integer, 
        IntegerLiteralKind.Hex
      )
    );
  }

  /**
   * @throws {Error}
   * @returns {Token}
   */
  lexBinary()
  {
    let value = "0b";
    this.advance();
    this.advance();

    if (!isbinary(this.char)) {
      throw new Error("unexpected digit after 0b");
    }

    do {
      value += this.char;
      this.advance();
    } while (isbinary(this.char));

    return this.token(
      value, 
      TokenKind.NumericLiteral, 
      new Specialization(
        NumericLiteralType.Integer, 
        IntegerLiteralKind.Binary
      )
    );
  }

  /**
   * @throws {Error}
   * @returns {Token}
   */
  lexString()
  {
    const startWith = this.char;

    let value = "";
    this.advance();

    while (this.char !== undefined && this.char !== startWith) {
      value += this.char;
      this.advance();
    }

    if (this.char === undefined) {
      throw new Error("unterminated string");
    }

    this.advance();

    return this.token(value, TokenKind.StringLiteral);
  }

  /**
   * @throws {Error}
   * @returns {Token}
   */
  nextToken()
  {
    while (this.char != undefined) {
      this.skipWhitespaces();

      if (isstrterm(this.char)) {
        return this.lexString();
      }

      if (isalpha(this.char)) {
        return this.lexIdentifier();
      }

      if (isdigit(this.char)) {
        return this.lexNumber();
      }

      switch (this.char) {
        case undefined: {
        } break;

        case "=": {
          return this.advanceCurrent(TokenKind.Equal);
        } break;

        case "&": {
          return this.advanceCurrent(TokenKind.Ampersand);
        } break;

        case "|": {
          return this.advanceCurrent(TokenKind.Bar);
        } break;

        case "-": {
          return this.advanceCurrent(TokenKind.Minus);
        } break;

        case "+": {
          return this.advanceCurrent(TokenKind.Plus);
        } break;

        case "*": {
          return this.advanceCurrent(TokenKind.Asterisk);
        } break;

        case "/": {
          return this.advanceCurrent(TokenKind.Slash);
        } break;

        case "(": {
          return this.advanceCurrent(TokenKind.OpenParen);
        } break;

        case ")": {
          return this.advanceCurrent(TokenKind.CloseParen);
        } break;

        case "{": {
          return this.advanceCurrent(TokenKind.OpenCurly);
        } break;

        case "}": {
          return this.advanceCurrent(TokenKind.CloseCurly);
        } break;

        case "<": {
          return this.advanceCurrent(TokenKind.LessThan);
        } break;

        case ">": {
          return this.advanceCurrent(TokenKind.GreaterThan);
        } break;

        case ";": {
          return this.advanceCurrent(TokenKind.Colon);
        } break;

        case "\n": {
          return this.advanceCurrent(TokenKind.NewLine);
        } break;

        case ":": {
          return this.advanceCurrent(TokenKind.Semicolon);
        } break;

        case ".": {
          return this.advanceCurrent(TokenKind.Dot);
        } break;

        case ",": {
          return this.advanceCurrent(TokenKind.Comma);
        } break;

        case "'": {
          return this.advanceCurrent(TokenKind.Apostrophe);
        } break;

        case "\"": {
          return this.advanceCurrent(TokenKind.QuotationMark);
        } break;

        default: {
          throw new Error(`unexpected character: '${this.char}'`);
        }
      }
    }

    this.exhasted = true;
    return this.token(undefined, TokenKind.Eof);
  }

  /**
   * @returns {void}
   */
  skipWhitespaces()
  {
    while (this.char == " " || this.char == "\t" || this.char == "\r") {
      this.advance();
    }
  }
}