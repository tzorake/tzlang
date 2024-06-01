import { NullValue, NumberValue, BooleanValue } from "./values.js";

export function TZ_NULL()
{
  return new NullValue();
}

export function TZ_NUMBER(value)
{
  return new NumberValue(value);
}

export function TZ_BOOLEAN(value)
{
  return new BooleanValue(value);
}