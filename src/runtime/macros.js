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
 * @typedef { (args: Array<RuntimeValue>, env: Environment) => RuntimeValue } Fn
 * @param {Fn} value 
 * 
 * @returns {FunctionValue}
 */
export function tzFunction(value)
{
  return new NativeFunctionValue(value);
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