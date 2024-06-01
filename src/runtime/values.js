let iota = 0;
export const RuntimeValueType = {
  Null      : iota++,
  Number    : iota++,
};

export class RuntimeValue
{
  constructor(type)
  {
    this.type = type;
  }
}

export class NullValue extends RuntimeValue
{
  constructor(value)
  {
    super(RuntimeValueType.Null);
    this.value = value;
  }
}

export class NumberValue extends RuntimeValue
{
  constructor(value)
  {
    super(RuntimeValueType.Number);
    this.value = value;
  }
}