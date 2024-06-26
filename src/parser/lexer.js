import { isdigit, isalpha, isalnum, isbinary, ishex, isstrterm } from "./utils.js"
import { Token, TokenWithSpecialization, TokenType, Specialization, NumericLiteralType, IntegerLiteralKind, RealLiteralKind } from './token.js';

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
   * @param {TokenType} type
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
   * @param {TokenType} type
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

    return this.token(value, TokenType.Identifier);
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
      TokenType.NumericLiteral, 
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
      TokenType.NumericLiteral, 
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
      TokenType.NumericLiteral, 
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

    return this.token(value, TokenType.StringLiteral);
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
        case "=": {
          if (this.peek(1) == ">") {
            this.advance();

            return this.advanceWith(
              this.token("=>", TokenType.Arrow)
            );
          }

          if (this.peek(1) == "=") {
            this.advance();
            
            return this.advanceWith(
              this.token("==", TokenType.DoubleEqual)
            );
          }

          return this.advanceCurrent(TokenType.Equal);
        } break;

        case "&": {
          if (this.peek(1) == "&") {
            this.advance();

            return this.advanceWith(
              this.token("&&", TokenType.DoubleAmpersand)
            );
          }

          return this.advanceCurrent(TokenType.Ampersand);
        } break;

        case "|": {
          if (this.peek(1) == "|") {
            this.advance();

            return this.advanceWith(
              this.token("||", TokenType.DoubleBar)
            );
          }

          return this.advanceCurrent(TokenType.Bar);
        } break;

        case "-": {
          if (this.peek(1) == "-") {
            this.advance();

            return this.advanceWith(
              this.token("--", TokenType.DoubleMinus)
            );
          }

          return this.advanceCurrent(TokenType.Minus);
        } break;

        case "+": {
          if (this.peek(1) == "+") {
            this.advance();

            return this.advanceWith(
              this.token("++", TokenType.DoublePlus)
            );
          }

          return this.advanceCurrent(TokenType.Plus);
        } break;

        case "*": {
          return this.advanceCurrent(TokenType.Asterisk);
        } break;

        case "/": {
          return this.advanceCurrent(TokenType.Slash);
        } break;

        case "(": {
          return this.advanceCurrent(TokenType.OpenParen);
        } break;

        case ")": {
          return this.advanceCurrent(TokenType.CloseParen);
        } break;

        case "{": {
          return this.advanceCurrent(TokenType.OpenCurly);
        } break;

        case "}": {
          return this.advanceCurrent(TokenType.CloseCurly);
        } break;

        case "<": {
          return this.advanceCurrent(TokenType.LessThan);
        } break;

        case ">": {
          return this.advanceCurrent(TokenType.GreaterThan);
        } break;

        case ";": {
          return this.advanceCurrent(TokenType.Colon);
        } break;

        case "\n": {
          return this.advanceCurrent(TokenType.NewLine);
        } break;

        case ":": {
          return this.advanceCurrent(TokenType.Semicolon);
        } break;

        case ".": {
          return this.advanceCurrent(TokenType.Dot);
        } break;

        case ",": {
          return this.advanceCurrent(TokenType.Comma);
        } break;

        case "'": {
          return this.advanceCurrent(TokenType.Apostrophe);
        } break;

        case "\"": {
          return this.advanceCurrent(TokenType.QuotationMark);
        } break;

        case undefined: {
        } break;

        default: {
          throw new Error(`unexpected character: '${this.char}'`);
        }
      }
    }

    this.exhasted = true;
    return this.token(undefined, TokenType.Eof);
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