import React from 'react'
import { useQuery } from '@based/react'
import { styled } from 'inlines'
import { Text, color, Row, IconUsers, IconTree } from '@based/ui'

export const ConnectionsWidget = () => {
  const { data: concurrentUsers } = useQuery('based:connections')
  const { data: uniqueUsers } = useQuery('based:analytics')

  console.log(uniqueUsers)

  return (
    <Row style={{ marginBottom: 24, gap: 16 }}>
      <styled.div
        style={{
          padding: '12px 24px',
          borderRadius: 8,
          display: 'flex',
          border: `1px solid ${color(
            'inputBorder',
            'neutralNormal',
            'default'
          )}`,
        }}
      >
        <IconTree style={{ marginRight: 6 }} />
        <Text weight="medium">Active Connections: {concurrentUsers || ''}</Text>
      </styled.div>
      <styled.div
        style={{
          padding: '12px 24px',
          display: 'flex',
          borderRadius: 8,
          border: `1px solid ${color(
            'inputBorder',
            'neutralNormal',
            'default'
          )}`,
        }}
      >
        <IconUsers style={{ marginRight: 6 }} />
        <Text weight="medium">
          Unique Users: {uniqueUsers?.uniqueUsers || ''}
        </Text>
      </styled.div>
    </Row>
  )
}
