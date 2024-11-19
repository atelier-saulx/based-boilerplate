import type { BasedFunction } from '@based/functions'

/************************************************************
 *                                                          *
 * Based functions of type 'function' are intended          *
 * to be used with the `.call()` method on the client.      *
 *                                                          *
 * Example:                                                 *
 * import based, { type BasedClient } from '@based/client'  *
 *                                                          *
 * export const based: BasedClient = based({                *
 *    org: 'your_org',                                      *
 *    project: 'your_project',                              *
 *    env: 'your_env'                                       *
 * })                                                       *
 *                                                          *
 * const greetings: string = await based.call(              *
 *    'hello',                                              *
 *    'Luigui'                                              *
 * )                                                        *
 *                                                          *
 * They return the data and are terminated until called     *
 * again.                                                   *
 *                                                          *
 * In this case the return will be:                         *
 * 'Hello, Luigui!'                                         *
 *                                                          *
 ************************************************************/
const hello: BasedFunction = async (_based, payload, _ctx) => {
  // You can define payloads as needed. They can be an array,
  // an object, or a single value, as shown in this example.
  let greetings: string

  if (payload) {
    greetings = `Hello, ${payload ?? ''}!`
  } else {
    greetings = '😊'
  }

  // All logs for this function can be monitored in the Based.io dashboard.
  console.log(greetings)

  // Remember to return the value to the client side.
  return greetings
}

export default hello
