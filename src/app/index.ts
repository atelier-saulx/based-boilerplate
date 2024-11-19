import type { BasedAppFunction } from '@based/functions'

/************************************************************
 *                                                          *
 * Functions of type 'app' are specialized in bundling      *
 * and serving frontend applications.                       *
 *                                                          *
 * In this case, the payload of this function will be an    *
 * object containing the CSS, JS, and favicon of your       *
 * application.                                             *
 *                                                          *
 * The returned value from this function can be any valid   *
 * HTML to be served at the 'path' property specified in     *
 * the 'based.config.ts' file.                                *
 *                                                          *
 * The JS file you set as the 'main' entry point will be     *
 * embedded in the <script> tag.                            *
 * In this case, it is a React application.                 *
 *                                                          *
 * All the files in this folder will be bundled if needed    *
 * and uploaded to the cloud when you deploy this function. *
 *                                                          *
 * No client-side actions are required to execute this      *
 * function.                                                *
 *                                                          *
 ************************************************************/
const app: BasedAppFunction = async (
  _based,
  { css, js, favicon },
  _ctx,
): Promise<string> => {
  return /* HTML */ `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1.0, minimum-scale=1.0, viewport-fit=cover"
        />
        <title>Hello world!</title>
        <link rel="icon" type="image/x-icon" href="${favicon.url}" />
        ${css ? `<link rel="stylesheet" href="${css.url}" />` : ''}
      </head>
      <body style="margin: 0;">
        <div id="root"></div>
        <script type="application/javascript" src="${js.url}"></script>
      </body>
    </html>`
}

export default app
