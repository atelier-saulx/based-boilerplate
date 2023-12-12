import { BasedClient } from '@based/client'

export const client = new BasedClient({
  org: 'demo',
  project: 'demo',
  env: 'production',
  name: '@based/env-admin-hub',
})
