export default async (based, payload) => {
  const user = await based
    .query('db', {
      $alias: decodeURIComponent(payload.token),
      status: true,
    })
    .get()

  if (user.$isNull) {
    throw new Error('Invalid User')
  }

  if (user.status !== 'validation') {
    throw new Error('Account already validated')
  }

  await based.call('db:set', {
    $alias: decodeURIComponent(payload.token),
    status: 'clear',
  })

  return 'Your email is registered.'
}
