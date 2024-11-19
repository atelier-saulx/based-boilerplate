import type { BasedQueryFunction } from '@based/functions'

/************************************************************
 *                                                          *
 * Based functions of type 'query' are intended to be used  *
 * with the `.query()` method on the client, followed by    *
 * the `.get()` or `.subscribe()` methods to receive the    *
 * data for the specified query.                             *
 *                                                          *
 * The `.get()` method executes the query and returns the   *
 * processed value only once.                               *
 *                                                          *
 * On the other hand, the `.subscribe()` method executes    *
 * the query and keeps it alive, receiving real-time        *
 * data updates as they occur.                              *
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
 * const counterOnce: number = based.query('counter').get() *
 * let counterLive: number = 0                              *
 * based.query('counter').subscribe((counting) => {         *
 *    counterLive = counting                                *
 * })                                                       *
 *                                                          *
 * `counterOnce` will receive the value once, meanwhile     *
 * `counterLive` will keep changing in real-time.           *
 *                                                          *
 ************************************************************/
const counter: BasedQueryFunction = async (_based, _payload, update) => {
  // In this case, there is no payload for this function.
  // However, you can always define a payload if needed.
  let count: number = 0

  const interval = setInterval(() => {
    // The 'update' parameter is a function used to update the client state.
    // Call this function whenever new data needs to be sent to the client.
    update(count++)
  }, 1e3)

  // Query functions should return a cleanup function,
  // which is executed when the connection is closed.
  return () => clearTimeout(interval)
}

export default counter
