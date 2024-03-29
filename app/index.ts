import { BasedAppFunction } from '@based/functions'

// Functions of type 'app' are specialized to
// bundle and serve frontend applications
const app: BasedAppFunction = async (_based, { css, js, favicon }, _ctx) => {
  return /* HTML */ `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1.0, minimum-scale=1.0, viewport-fit=cover"
        />
        <meta name="title" content="_project_title_" />
        <title>_project_title_</title>
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
