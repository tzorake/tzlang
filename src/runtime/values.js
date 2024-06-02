
/**
 * @param {number}
 */
let iota = 0;
/**
 * @readonly
 * @enum {number}
 */
export const RuntimeValueType = {
  Null      : iota++,
  Number    : iota++,
  Boolean   : iota++,
};

export class RuntimeValue
{
  /**
   * @constructor
   * @param {RuntimeValueType} type
   */
  constructor(type)
  {
    /**
     * The type of the runtime value.
     * @type {RuntimeValueType}
     */
    this.type = type;
  }
}

export class NullValue extends RuntimeValue
{
  /**
   * @constructor
   */
  constructor()
  {
    super(RuntimeValueType.Null);
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
    super(RuntimeValueType.Boolean);
    /**
     * @type {boolean}
     */
    this.value = value;
  }
}

export class NumberValue extends RuntimeValue
{
  /**
   * @param {number} value
   */
  constructor(value)
  {
    super(RuntimeValueType.Number);
    /**
     * @type {number}
     */
    this.value = value;
  }
}