import React from 'react'
import {
  Stack,
  Code,
  Container,
  Thumbnail,
  IconTree,
  IconUsers,
  Page,
} from '@based/ui'
import Env from '../../based.json'
import { useQuery } from '@based/react'

export const Dashboard = () => {
  const { data: concurrentUsers } = useQuery('based:connections')
  const { data: uniqueUsers } = useQuery('based:analytics')

  return (
    <Page>
      <Stack style={{ maxWidth: 274 }} grid>
        <Container
          prefix={<Thumbnail icon={<IconUsers />} color="auto-muted" />}
          // @ts-ignore
          title={`Unique Users: ${uniqueUsers?.uniqueUsers || ''}`}
        />
        <Container
          prefix={<Thumbnail icon={<IconTree />} color="positive-muted" />}
          title={`Active Connections: ${concurrentUsers || ''}`}
        />
        <Code language="json" value={JSON.stringify(Env, null, 2)} />
      </Stack>
    </Page>
  )
}
