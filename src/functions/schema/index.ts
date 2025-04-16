import type { BasedDb, DbClient } from '@based/db'
import type { BasedQueryFunction } from '@based/functions'

export default (async (based, _payload, update) => {
  const db = based.db.v2 as DbClient | BasedDb

  update((db as DbClient).schema || (db as BasedDb).client?.schema || {})

  if (db.on) {
    db.on('schema', (schema) => {
      update(schema)
    })
    return db.off('schema', update)
  }

  return () => {}
}) as BasedQueryFunction
