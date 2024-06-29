import { Environment } from "./environment.js";
import { NullValue, FloatValue, BooleanValue, FunctionValue, NativeFunctionValue } from "./values.js";

/**
 * @returns {NullValue}
 */
export function tzNull()
{
  return new NullValue();
}

/**
 * @param {number} value 
 * 
 * @returns {FloatValue}
 */
export function tzFloat(value)
{
  return new FloatValue(value);
}
/**
 * @typedef {(args: Array<RuntimeValue>, env: Environment) => RuntimeValue} NativeFunction
 */

/**
 * @param {NativeFunction} value 
 * @param {Environment} env
 * 
 * @returns {FunctionValue}
 */
export function tzFunction(value, env)
{
  return new NativeFunctionValue(value, env);
}

/**
 * @param {boolean} value 
 * 
 * @returns {BooleanValue}
 */
export function tzBoolean(value)
{
  return new BooleanValue(value);
}