import React, { useEffect, useState } from 'react'
import { styled } from 'inlines'
import { Row, Text, Button } from '@based/ui'
import { useClient } from '@based/react'

export const Backups = () => {
  const [backups, setBackups] = useState()

  const client = useClient()

  useEffect(() => {
    let killed

    client.call('based:backups-list').then((data) => {
      if (!killed) {
        setBackups(data.backups)
      }
      console.log(data)
    })

    return () => {
      killed = true
    }
  }, [])

  console.log(backups)

  // client.call('db:get', {})

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
          Restore a backup from a certain moment in time. Backups get stored
          every 15 minutes.
        </Text>
      </div>

      <styled.div style={{ padding: 24, background: 'lightgrey' }}>
        <Text>Select a backup</Text>

        <Button
          onClick={async () => {
            const data = await client.call('based:backups-list')
            console.log(data)
          }}
        >
          Restore
        </Button>
      </styled.div>
    </styled.div>
  )
}
