#!/usr/bin/env node

function parseArgs(argsArray) {
  const args = {}

  for (let i = 0; i < argsArray.length; i++) {
    const arg = argsArray[i]

    if (arg.startsWith('--')) {
      const key = arg.slice(2)
      const next = argsArray[i + 1]

      args[key] = next && !next.startsWith('--') ? next : true

      if (next && !next.startsWith('--')) {
        i++
      }
    }
  }

  return args
}

const args = parseArgs(process.argv.slice(2))

if (!args.url || !args.email) {
  process.exit(1)
}
;(async () => {
  try {
    const isTheUserThere = await fetch(`${args.url}/db2`, {
      method: 'post',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        type: 'user',
        alias: {
          email: args.email,
        },
      }),
    })

    if (!isTheUserThere.ok) {
      throw new Error(`${isTheUserThere.status} ${isTheUserThere.statusText}`)
    }

    const userFound = await isTheUserThere.json()

    if (userFound.$isNull) {
      const addUser = await fetch(`${args.url}/create`, {
        method: 'post',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          type: 'user',
          name: args.email.split('@')[0],
          email: args.email,
          role: 'admin',
        }),
      })

      await addUser.json()
    }

    process.exit(0)
  } catch (error) {
    console.error(error)

    process.exit(1)
  }
})()
