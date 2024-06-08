import { NullValue, FloatValue, BooleanValue } from "./values.js";

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
 * @param {boolean} value 
 * 
 * @returns {BooleanValue}
 */
export function tzBoolean(value)
{
  return new BooleanValue(value);
}