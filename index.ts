export default async (based, { css, js, favicon }, ctx) => {
  return /* HTML */ `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1.0, minimum-scale=1.0, viewport-fit=cover"
        />
        <meta name="title" content="based.io" />
        <title>based.io</title>
        <style>
          ${await css.text}
        </style>
      </head>
      <body style="margin: 0;">
        <div id="root"></div>
        <script>
          ${await js.text}
        </script>
      </body>
    </html>`
}
