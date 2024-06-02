import { NullValue, NumberValue, BooleanValue } from "./values.js";

/**
 * @returns {NullValue}
 */
export function TZ_NULL()
{
  return new NullValue();
}

/**
 * @param {number} value 
 * 
 * @returns {NumberValue}
 */
export function TZ_NUMBER(value)
{
  return new NumberValue(value);
}

/**
 * @param {boolean} value 
 * 
 * @returns {BooleanValue}
 */
export function TZ_BOOLEAN(value)
{
  return new BooleanValue(value);
}