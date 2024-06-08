import { NodeKind } from "./statements/base.js";

/**
 * @returns {void}
 */
export function tzLog(...messages)
{
  console.info(...messages);
}

/**
 * @returns {void}
 */
export function tzInspectObject(object)
{
  console.dir(object, { depth: null });
}

/**
 * @returns {void}
 */
export function tzDeclaredNodeKinds()
{
  tzInspectObject(NodeKind);
}

/**
 * @returns {void}
 */
export function tzNotImplemented()
{
  throw new Error("not implemented!");
}