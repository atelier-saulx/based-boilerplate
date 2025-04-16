import type { BasedQueryFunction } from '@based/functions'

export default (async (based, payload, update) => {
  if (!payload?.type) {
    throw new Error('No type in total payload')
  }

  return based
    .query('db2', { type: payload.type })
    .subscribe((d) => update({ total: d?.length || 0 }))
}) as BasedQueryFunction
