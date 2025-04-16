import type { SchemaType } from '@based/schema'
import { createdAt, roles, updatedAt } from './shared.js'

export const user: SchemaType = {
  name: 'string',
  email: { type: 'alias', format: 'email' },
  role: roles,
  createdAt,
  updatedAt,
  inactive: 'boolean',
}
