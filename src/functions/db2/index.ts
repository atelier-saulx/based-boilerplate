import type { BasedDb } from '@based/db'
import type { BasedDbQuery } from '@based/db/dist/src/client/query/BasedDbQuery.js'
import type { Operator } from '@based/db/dist/src/client/query/query.js'
import type { BasedQueryFunction } from '@based/functions'
import type { LangName } from '@based/schema'

type FilterGroupItem = { field: string; operator: Operator; value: string }
type Filter = {
  operator: 'and' | 'or'
  items: FilterGroupItem[]
  nested?: {
    operator: 'and' | 'or'
    group: Filter
  }
}

export const timerSub = (
  q: BasedDbQuery,
  update: (data: any, checksum: any) => void,
) => {
  return q.subscribe((res: any) => {
    const checksum = res.checksum
    const x = res.toObject()
    update(x || { $isNull: true }, checksum)
  })
}

export default (async (based, payload, update) => {
  const db = based.db.v2 as BasedDb
  if (!payload) {
    throw new Error('no payload for db2')
  }

  const type: string = payload.type
  const alias: any = payload.alias
  const id: number = payload.id
  const sort = payload.sort
  const offset = payload.offset
  const limit = payload.limit
  const include: string[] = payload.include
  const filter: Filter = payload.filter
  const lang: string = payload.lang

  if (id && !type) {
    throw new Error('Missing type')
  }

  let query: BasedDbQuery

  if (!type) {
    query = db.query()
  } else if (!alias) {
    query = db.query(type, Number(id))
  } else {
    query = db.query(type, alias)
  }

  if (include) {
    query = query.include(...include)
  } else {
    query = query.include('*', '**')
  }

  if (lang) {
    query = query.locale(lang as LangName)
  } else {
    query = query.locale('en')
  }

  if (sort) {
    query = query.sort(sort.key, sort.direction)
  }

  if (offset) {
    query.range(offset, limit)
  }

  if (filter) {
    if (filter.operator === 'and') {
      for (const f of filter.items) {
        query.filter(f.field, f.operator, f.value)
      }
    } else if (filter.operator === 'or') {
      if (filter.items.length > 2) {
        const f0 = filter.items[0]
        query.filter(f0.field, f0.operator, f0.value).or((fn) => {
          addToFilter(filter.items, filter.items.length, 1, fn)
        })
      } else {
        let i = 0
        for (const f of filter.items) {
          if (i === 0) {
            query.filter(f.field, f.operator, f.value)
          } else {
            query.or(f.field, f.operator, f.value)
          }
          i++
        }
      }
    } else {
      throw new Error('Unsupported filter operator')
    }
  }

  let cleanUpTimerSub = timerSub(query, update)

  const schemaListener = () => {
    cleanUpTimerSub()
    cleanUpTimerSub = timerSub(query, update)
  }

  db.on('schema', schemaListener)

  return () => {
    cleanUpTimerSub()
    db.off('schema', schemaListener)
  }
}) as BasedQueryFunction

function addToFilter(
  filterItems: FilterGroupItem[],
  total: number,
  nextIdx: number,
  filterCb: any,
) {
  const f = filterItems[nextIdx]

  if (nextIdx === total - 1) {
    filterCb.filter(f.field, f.operator, f.value)
    return
  }

  filterCb.filter(f.field, f.operator, f.value).or((fn: any) => {
    addToFilter(filterItems, total, nextIdx + 1, fn)
  })
}
