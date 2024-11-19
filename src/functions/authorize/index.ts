import type { Authorize } from '@based/functions'

/************************************************************
 *                                                          *
 * Authorize functions are executed every time the client   *
 * calls a function. They return a boolean value indicating *
 * whether to allow or block the request.                   *
 *                                                          *
 * These functions act as middleware, running before each   *
 * function is executed.                                    *
 *                                                          *
 * No client-side actions are required to execute this      *
 * function.                                                *
 *                                                          *
 ************************************************************/
const authorize: Authorize = async (_based, _ctx, _name, _payload) => {
  // You can perform any kind of validation to determine
  // whether the user is allowed to execute the function.
  return true
}

export default authorize
