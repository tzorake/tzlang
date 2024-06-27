import { isdigit, isalpha, isalnum, isbinary, ishex, isstrterm } from "./utils.js"
import { Token, TokenWithSpecialization, TokenKind, Specialization, NumericLiteralType, IntegerLiteralKind, RealLiteralKind } from './token.js';

export class LexerState
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
   * @returns {LexerState}
   */
  copy()
  {
    const state = new LexerState();
    state.source = this.source;
    state.size = this.size;
    state.index = this.index;
    state.char = this.char;
    state.exhasted = this.exhasted;

    return state;
  }

  /**
   * @returns {void}
   */
  reset()
  {
    this.source = "";
    this.size = 0;

    this.index = 0;
    this.char = this.source[this.index];
    this.exhasted = false;
  }
}

export class Lexer
{
  /**
   * @constructor
   */
  constructor()
  {
    /**
     * @type {LexerState}
     */
    this.state = new LexerState();
    /**
     * @type {Array<LexerState>} 
     */
    this.stack = [];
  }

  /**
   * @returns {Lexer}
   */
  save()
  {
    this.stack.push(
      this.state.copy()
    );

    return this;
  }

  /**
   * @returns {Lexer}
   */
  restore()
  {
    if (this.stack.length > 0) {
      this.state = this.stack.pop();
    }

    return this;
  }

  /**
   * @returns {void}
   */
  reset()
  {
    this.state.reset();
  }

  /**
   * @param {string} source
   * 
   * @returns {void}
   */
  setSource(source)
  {
    this.state.reset();
    this.state.source = source;
    this.state.size = source.length;
    this.state.index = 0;
    this.state.char = this.state.source[this.state.index];
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
    if (this.state.index < this.state.size && this.state.char != undefined) {
      this.state.index++;
      this.state.char = this.state.source[this.state.index];
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
    return this.state.source[this.state.index + offset];
  }

  /**
   * @param {number} [offset=0]
   * @param {string} char
   * 
   * @returns {boolean}
   */
  checkedPeek(offset = 0, char)
  {
    if (this.state.index + offset >= this.state.size) {
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
    const value = this.state.char;
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
      value += this.state.char;
      this.advance();
    } while (isalnum(this.state.char));

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
      value += this.state.char;
      this.advance();
    } while (isdigit(this.state.char));

    let isFloat = false;
    let isScientific = false;

    if (this.state.char === ".") {
      isFloat = true;
      isScientific = false;

      value += this.state.char;
      this.advance();

      do {
        value += this.state.char;
        this.advance();
      } while (isdigit(this.state.char));
    }

    if (this.state.char === "e" || this.state.char === "E") {
      isFloat = true;
      isScientific = true;

      value += this.state.char;
      this.advance();
      if (this.state.char === "+" || this.state.char === "-") {
        value += this.state.char;
        this.advance();
      }
      
      do {
        value += this.state.char;
        this.advance();
      } while (isdigit(this.state.char));
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

    if (!ishex(this.state.char)) {
      throw new Error("unexpected digit after 0x");
    }

    do {
      value += this.state.char;
      this.advance();
    } while (ishex(this.state.char));

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

    if (!isbinary(this.state.char)) {
      throw new Error("unexpected digit after 0b");
    }

    do {
      value += this.state.char;
      this.advance();
    } while (isbinary(this.state.char));

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
    const startsWith = this.state.char;

    let value = "";
    this.advance();

    while (this.state.char !== undefined && this.state.char !== startsWith) {
      value += this.state.char;
      this.advance();
    }

    if (this.state.char === undefined) {
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
    while (this.state.char != undefined) {
      this.skipWhitespaces();

      if (isstrterm(this.state.char)) {
        return this.lexString();
      }

      if (isalpha(this.state.char)) {
        return this.lexIdentifier();
      }

      if (isdigit(this.state.char)) {
        return this.lexNumber();
      }

      switch (this.state.char) {
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
          throw new Error(`unexpected character: '${this.state.char}'`);
        }
      }
    }

    this.state.exhasted = true;
    return this.advanceCurrent(TokenKind.Eof);
  }

  /**
   * @returns {void}
   */
  skipWhitespaces()
  {
    while (this.state.char == " " || this.state.char == "\t" || this.state.char == "\r") {
      this.advance();
    }
  }
}