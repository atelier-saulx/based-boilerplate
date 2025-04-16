import type { Schema } from '@based/schema'
import { user } from './user.js'

const schema: Schema = {
  types: {
    user,
  },
}

export default JSON.parse(JSON.stringify(schema))
