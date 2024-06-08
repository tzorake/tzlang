import { isclass } from "./utils.js";
import { NodeKind } from "./statements/statements.js";

/**
 * @param {number}
 */
let iota = 0;

/**
 * @param {any} className 
 * 
 * @returns {void}
 */
export function TZ_DECLARE_NODE_KIND(className)
{
  if (isclass(className)) {
    NodeKind[className.name] = iota++;
  }
}

/**
 * @returns {void}
 */
export function TZ_LOG(...messages)
{
  console.info(...messages);
}

/**
 * @returns {void}
 */
export function TZ_INSPECT_OBJECT(object)
{
  console.dir(object, { depth: null });
}

/**
 * @returns {void}
 */
export function TZ_DECLARED_NODE_KINDS()
{
  TZ_INSPECT_OBJECT(NodeKind);
}

/**
 * @returns {void}
 */
export function TZ_NOT_IMPLEMENTED()
{
  throw new Error("not implemented!");
}