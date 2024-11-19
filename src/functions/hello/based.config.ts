import type { BasedFunctionConfig } from '@based/functions'

const config: BasedFunctionConfig = {
  /************************************************************
   *                                                          *
   * For the 'type' of BasedFunctions you can have:           *
   *                                                          *
   * - 'app':       Deploys a frontend application.           *
   * - 'channel':   Keeps the connection open to receive data *
   *                from the server.                          *
   * - 'function':  Processes data.                           *
   * - 'job':       Schedules a function to run periodically. *
   * - 'query':     Fetches data from the database.           *
   * - 'stream':    Handles uploaded files.                    *
   * - 'authorize': Acts like a middleware to validate access *
   *                to other functions.                       *
   *                                                          *
   ************************************************************/
  type: 'function',
  /************************************************************
   * 'name' receives a string, is the name of your function.  *
   ************************************************************/
  name: 'hello',
  /************************************************************
   *                                                          *
   * 'public' is a boolean that defines whether your function  *
   * is accessible externally.                                *
   *                                                          *
   * If you want to restrict access to this function over     *
   * the internet, you can set this value to 'false'.         *
   *                                                          *
   ************************************************************/
  public: true,
}

export default config
