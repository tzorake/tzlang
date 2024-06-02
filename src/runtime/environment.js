import { RuntimeValue } from "./values.js";

export class Environment
{
  /**
   * @constructor
   * @param {Environment} parent
   */
  constructor(parent)
  {
    this.parent = parent;
    this.variables = {};
    this.constants = [];
  }

  /**
   * @returns {void}
   */
  reset()
  {
    this.variables = {};
    this.constants = [];
  }

  /**
   * @param {string} name
   * 
   * @throws {Error}
   * @returns {RuntimeValue}
   */
  resolve(name)
  {
    if (this.has(name)) {
      return this.variables[name];
    }

    if (this.parent != undefined) {
      return this.parent.resolve(name);
    }

    throw new Error(`variable '${name}' is not defined!`);
  }

  /**
   * @param {string} name
   * @param {RuntimeValue} value
   * @param {boolean} constant
   * 
   * @throws {Error}
   * @returns {RuntimeValue}
   */
  define(name, value, constant = false)
  {
    if (this.has(name)) {
      throw new Error(`variable '${name}' is already defined!`);
    }

    this.variables[name] = value;
    if (constant) {
      this.constants.push(name);
    }

    return value;
  }

  /**
   * @param {string} name
   * @param {RuntimeValue} value
   * 
   * @throws {Error}
   * @returns {RuntimeValue}
   */
  defineConstant(name, value)
  {
    return this.define(name, value, true);
  }

  /**
   * @param {string} name
   * @param {RuntimeValue} value
   * 
   * @throws {Error}
   * @returns {RuntimeValue}
   */
  assign(name, value)
  {
    if (this.constant(name)) {
      throw new Error(`variable '${name}' is a constant!`);
    }

    if (!this.has(name)) {
      throw new Error(`variable '${name}' is not defined!`);
    }

    this.variables[name] = value;
      
    return value;
  }

  /**
   * @param {string} name
   * 
   * @returns {boolean}
   */
  has(name) {
    return Object.hasOwn(this.variables, name);
  }

  /**
   * @param {string} name
   * 
   * @returns {boolean}
   */
  constant(name) {
    return this.constants.includes(name);
  }

  /**
   * @param {string} name
   * 
   * @throws {Error}
   * @returns {RuntimeValue}
   */
  lookup(name) {
    return this.resolve(name);
  }
}