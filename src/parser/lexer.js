import { isdigit, isalpha, isalnum, isbinary, ishex, isstrterm } from "./utils.js"
import { Token, TokenWithSpecialization, TokenKind, Specialization, NumericLiteralType, IntegerLiteralKind, RealLiteralKind } from './token.js';

export class Lexer
{
  /**
   * @constructor
   */
  constructor()
  {
    /**
     * @type {string}
     */
    this.source = "";
    /**
     * @type {number}
     */
    this.size = 0;

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
   * @returns {void}
   */
  reset()
  {
    this.index = 0;
    this.char = this.source[this.index];
    this.exhasted = false;
  }

  /**
   * @returns {string}
   */
  setSource(source)
  {
    this.source = source;
    this.size = source.length;
    this.reset();
  }

  /**
   * @param {TokenKind} type
   * @param {string} value
   * @param {number} precedence
   * @param {Specialization} specialization
   * 
   * @returns {Token}
   */
  token(type, value, precedence = 0, specialization = null)
  {
    return specialization 
      ? new TokenWithSpecialization(type, value, precedence, specialization) 
      : new Token(type, value, precedence);
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
  advanceCurrent(type, precedence)
  {
    const value = this.char;
    this.advance();
    
    return this.token(type, value, precedence);
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

    return this.token(TokenKind.Identifier, value);
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

      if (!isdigit(this.peek(1))) {
        return this.advanceWith(
          this.token(TokenKind.NumericLiteral, "0")
        );
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
      TokenKind.NumericLiteral, 
      value, 
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
      TokenKind.NumericLiteral, 
      value, 
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
      TokenKind.NumericLiteral, 
      value, 
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

    return this.token(TokenKind.StringLiteral, value);
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
          if (this.peek(1) === ">") {
            this.advance();

            return this.advanceWith(
              this.token(TokenKind.EqualGreaterThan, "=>")
            );
          }

          if (this.peek(1) === "=") {
            this.advance();

            return this.advanceWith(
              this.token(TokenKind.EqualEqual, "==", 8)
            );
          }

          return this.advanceCurrent(TokenKind.Equal, 1);
        } break;

        case "&": {
          if (this.peek(1) === "&") {
            this.advance();

            return this.advanceWith(
              this.token(TokenKind.AmpersandAmpersand, "&&", 5)
            );
          }

          return this.advanceCurrent(TokenKind.Ampersand, 7);
        } break;

        case "|": {
          if (this.peek(1) === "|") {
            this.advance();

            return this.advanceWith(
              this.token(TokenKind.BarBar, "||", 4)
            );
          }

          return this.advanceCurrent(TokenKind.Bar, 6);
        } break;

        case "+": {
          return this.advanceCurrent(TokenKind.Plus, 10);
        } break;

        case "-": {
          return this.advanceCurrent(TokenKind.Minus, 10);
        } break;

        case "*": {
          return this.advanceCurrent(TokenKind.Asterisk, 20);
        } break;

        case "/": {
          return this.advanceCurrent(TokenKind.Slash, 20);
        } break;

        case "(": {
          return this.advanceCurrent(TokenKind.OpenParen);
        } break;

        case ")": {
          return this.advanceCurrent(TokenKind.CloseParen);
        } break;

        case "[": {
          return this.advanceCurrent(TokenKind.OpenBracket);
        } break;

        case "]": {
          return this.advanceCurrent(TokenKind.CloseBracket);
        } break;

        case "{": {
          return this.advanceCurrent(TokenKind.OpenCurly);
        } break;

        case "}": {
          return this.advanceCurrent(TokenKind.CloseCurly);
        } break;

        case "<": {
          if (this.peek(1) === "=") {
            this.advance();

            return this.advanceWith(
              this.token(TokenKind.LessThanEqual, "<=", 9)
            );
          }

          return this.advanceCurrent(TokenKind.LessThan, 9);
        } break;

        case ">": {
          if (this.peek(1) === "=") {
            this.advance();

            return this.advanceWith(
              this.token(TokenKind.GreaterThanEqual, ">=", 9)
            );
          }

          return this.advanceCurrent(TokenKind.GreaterThan, 9);
        } break;

        case ";": {
          return this.advanceCurrent(TokenKind.Colon);
        } break;

        case "\n": {
          return this.advanceCurrent(TokenKind.Eol);
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
    return this.advanceCurrent(TokenKind.Eof);
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