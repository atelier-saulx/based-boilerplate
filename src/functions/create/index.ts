import type { BasedDb } from '@based/db'
import type { BasedFunction } from '@based/functions'

export default (async (based, payload = {}) => {
  const db = based.db.v2 as BasedDb

  const { type, id, $$lang, ...set } = payload
  const options = $$lang ? { locale: $$lang } : undefined

  if (!type || type === '_root') {
    throw new Error('Cannot `create` with type _root')
  }

  return await db.create(type, set, options)
}) as BasedFunction
