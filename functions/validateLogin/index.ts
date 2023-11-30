export default async (based, payload, ctx) => {
  const user = await based
    .query('db', {
      $alias: decodeURIComponent(payload.token),
      status: true,
      id: true,
    })
    .get()

  if (user.$isNull) {
    throw new Error('Invalid User')
  }

  if (user.status !== 'login') {
    throw new Error('no login')
  }

  await based.call('db:set', {
    $id: user.id,
    currentToken: payload.token,
    status: 'clear',
  })

  return 'Succes, logging in!'
}
