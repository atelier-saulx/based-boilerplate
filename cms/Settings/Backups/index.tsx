import React from 'react'
import { styled } from 'inlines'
import { Row, Text } from '@based/ui'

export const Backups = () => {
  return (
    <styled.div style={{ padding: '24px 48px', width: '100%' }}>
      <div
        style={{
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 32,
        }}
      >
        <Text size={24} weight="strong" style={{ marginBottom: 24 }}>
          Backups
        </Text>
        <Text light>
          Restore a backup from a certain time. Backups get stored every 15
          minutes.
        </Text>
      </div>
    </styled.div>
  )
}
