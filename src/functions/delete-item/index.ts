import type { BasedDb } from '@based/db'
import type { BasedFunction } from '@based/functions'

export default (async (based, payload = {}) => {
  const db = based.db.v2 as BasedDb

  if (payload.type && payload.id) {
    db.delete(payload.type, payload.id)
  }
}) as BasedFunction
