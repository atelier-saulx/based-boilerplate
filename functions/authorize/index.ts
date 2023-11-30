import { Authorize } from '@based/functions'
import { verify, sign } from '@saulx/crypto'

const weekMs = 604_800_000

const authorize: Authorize = async (based, ctx, name, payload) => {
  // return true
  //@ts-ignore
  const { token } = ctx.session.authState
  if (!token) {
    return false
  }
  try {
    const publicKey = await based.query('based:secret', 'userPublicKey').get()
    const tokenObj = verify<{ expiresAt: number; userId: string }>(
      token,
      publicKey
    )
    const now = Date.now()
    if (tokenObj.expiresAt < now) {
      if (tokenObj.expiresAt < now - weekMs) {
        //super old
        based.renewAuthState(ctx, {})
        return false
      }
      const privateKey = await based
        .query('based:secret', 'userPrivateKey')
        .get()
      const newToken = sign(
        { ...tokenObj, expiresAt: Date.now() + weekMs },
        privateKey
      )
      based.renewAuthState(ctx, {
        token: newToken,
        persistent: true,
        userId: tokenObj.userId,
      })
    }
    return true
  } catch (e) {
    console.error(e)
    return false
  }
}

export default authorize
