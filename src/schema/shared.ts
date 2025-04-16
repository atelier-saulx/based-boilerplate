import type { SchemaProp } from '@based/schema'

export const createdAt: SchemaProp = {
  type: 'timestamp',
  on: 'create',
}

export const updatedAt: SchemaProp = {
  type: 'timestamp',
  on: 'update',
}

export const roles = ['admin', 'viewer']
