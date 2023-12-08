import React from 'react'
import { styled } from 'inlines'
import { StarterWidget } from './StarterWidget'
import { ShowEnvWidget } from './showEnvWidget'
import { ConnectionsWidget } from './ConnectionsWidget'

export const Dashboard = () => {
  return (
    <styled.div
      style={{
        padding: '24px 48px',
        width: '100%',
        maxWidth: 924,
        marginTop: 16,
      }}
    >
      <StarterWidget />
      <ShowEnvWidget />
      <ConnectionsWidget />
    </styled.div>
  )
}
