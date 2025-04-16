import type { BasedDb } from '@based/db'
import type { BasedFunction } from '@based/functions'

export default (async (based, payload = {}) => {
  const db = based.db.v2 as BasedDb

  const { type, id, $$lang, ...set } = payload
  const options = $$lang ? { locale: $$lang } : undefined

  if (!type || type === '_root') {
    const res = await db.update(set, options)
    return res
  }

  if (!id) {
    throw new Error('Cannot use `update` without id, use `upsert` instead')
  }

  return await db.update(type, Number(id), set, options)
}) as BasedFunction
