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
   * - 'stream':    Handles uploaded files.                   *
   * - 'authorize': Acts like a middleware to validate access *
   *                to other functions.                       *
   *                                                          *
   ************************************************************/
  type: 'app',
  /************************************************************
   * 'name' receives a string, is the name of your app.       *
   ************************************************************/
  name: 'my-cms',
  /************************************************************
   *                                                          *
   * 'public' is a boolean that defines whether your function *
   * is accessible externally.                                *
   *                                                          *
   * If you want to restrict access to this function over     *
   * the internet, you can set this value to 'false'.         *
   *                                                          *
   ************************************************************/
  public: true,
  /************************************************************
   *                                                          *
   * 'main' sets the entry point of your application.         *
   *                                                          *
   * Specify the file where your application starts.          *
   * This is typically the main logic or component.           *
   *                                                          *
   ************************************************************/
  main: './app.tsx',
  /************************************************************
   *                                                          *
   * 'path' defines the route of your application after the   *
   * domain.                                                  *
   *                                                          *
   * For example, if your application is available at:        *
   * 'www.yourdomain.com/path', you should set this value to  *
   * '/path'.                                                 *
   *                                                          *
   * Default is typically '/'.                                *
   *                                                          *
   ************************************************************/
  path: '/cms/:path*',
  /************************************************************
   *                                                          *
   * 'favicon' receives a string representing the path to     *
   * the favicon file for your application. This icon will    *
   * be displayed in the browser's tab.                       *
   *                                                          *
   * Example: './favicon.ico'                                 *
   *                                                          *
   ************************************************************/
  favicon: './favicon.ico',
}

export default config
