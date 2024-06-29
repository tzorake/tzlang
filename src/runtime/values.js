import { Identifier } from "../parser/statements/expressions.js";
import { BlockStatement } from "../parser/statements/statements.js";
import { Environment } from "./environment.js";

/**
 * @param {number}
 */
let iota = 0;
/**
 * @readonly
 * @enum {number}
 */
export const RuntimeValueKind = {
  Null           : iota++,
  Float          : iota++,
  Boolean        : iota++,
  NativeFunction : iota++,
  Function       : iota++,
};

export class RuntimeValue
{
  /**
   * @constructor
   * @param {RuntimeValueKind} kind
   */
  constructor(kind)
  {
    /**
     * The type of the runtime value.
     * @type {RuntimeValueKind}
     */
    this.kind = kind;
  }
}

export class NullValue extends RuntimeValue
{
  /**
   * @constructor
   */
  constructor()
  {
    super(RuntimeValueKind.Null);
    /**
     * @type {null}
     */
    this.value = null;
  }
}

export class BooleanValue extends RuntimeValue
{
  /**
   * @param {boolean} value
   */
  constructor(value)
  {
    super(RuntimeValueKind.Boolean);
    /**
     * @type {boolean}
     */
    this.value = value;
  }
}

export class FloatValue extends RuntimeValue
{
  /**
   * @param {number} value
   */
  constructor(value)
  {
    super(RuntimeValueKind.Float);
    /**
     * @type {number}
     */
    this.value = value;
  }
}

export class FunctionValue extends RuntimeValue
{
  /**
   * @param {Array<Identifier>} args
   * @param {BlockStatement} body
   * @param {Environment} env
   */
  constructor(args, body, env)
  {
    super(RuntimeValueKind.Function);
    /**
     * @type {Array<Identifier>}
     */
    this.args = args;
    /**
     * @type {BlockStatement}
     */
    this.body = body;
    /**
     * @type {Environment}
     */
    this.env = env;
  }
}

export class NativeFunctionValue extends RuntimeValue
{
  /**
   * @typedef {(args: Array<RuntimeValue>, env: Environment) => RuntimeValue} NativeFunction
   */

  /**
   * @param {NativeFunction} fn
   * @param {Environment} env
   */
  constructor(fn, env)
  {
    super(RuntimeValueKind.NativeFunction);
    /**
     * @type {NativeFunction}
     */
    this.fn = fn;
    /**
     * @type {Environment}
     */
    this.env = env;
  }
}