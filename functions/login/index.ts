import { sign } from '@saulx/crypto'
import { Client as PostmarkClient } from 'postmark'
import crypto from 'crypto'
import { BasedFunction } from '@based/functions'
import { wait } from '@saulx/utils'
import { template } from './template'

const weekMs = 604_800_000

const generateEmailToken = (): Promise<string> =>
  new Promise((resolve) =>
    crypto.randomBytes(48, (_, buffer) => resolve(buffer.toString('hex')))
  )

const login: BasedFunction<
  {
    email: string
    displayCode: string
  },
  void
> = async (based, payload, ctx) => {
  const { email, displayCode } = payload
  const postMarkKey = await based.query('based:secret', 'postmarkKey').get()
  const postMarkClient = new PostmarkClient(postMarkKey)

  if (!email || !displayCode) {
    throw new Error('Please fill in an email ands code')
  }

  const user = await based.call('db:get', {
    $alias: email,
    id: true,
    name: true,
    status: true,
  })

  if (user.$isNull) {
    throw new Error('User not found')
  }
  if (user.status === 'validation') {
    throw new Error('Account verification needed')
  }
  const emailToken = await generateEmailToken()

  await based.call('db:set', {
    $id: user.id,
    aliases: [emailToken, email],
    status: 'login',
  })

  const url = `https://${
    process.env.DOMAIN
  }/validateLogin?token=${encodeURIComponent(emailToken)}`

  await postMarkClient.sendEmail({
    From: `ONCE Website <all@once.net>`,
    To: email,
    Subject: 'Login!',
    TextBody: `CMS login`,
    HtmlBody: template(url, displayCode),
  })

  const loginResult = await Promise.race([
    await based
      .query('db', { $id: user.id, currentToken: true })
      .getWhen((data) => {
        return data.currentToken === emailToken
      }),
    wait(60e3 * 5),
  ])

  if (!loginResult) {
    throw new Error('email token exceeded')
  }

  const privateKey = await based.query('based:secret', 'userPrivateKey').get()

  const token = sign(
    { userId: user.id, expiresAt: Date.now() + weekMs },
    privateKey
  )

  await based.renewAuthState(ctx, { token, persistent: true, userId: user.id })
}

export default login
