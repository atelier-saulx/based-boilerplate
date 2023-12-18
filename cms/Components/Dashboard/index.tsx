import React from 'react'
import { styled } from 'inlines'
import { ShowEnvWidget } from './ShowEnvWidget'
import { ConnectionsWidget } from './ConnectionsWidget'
import { Button, Row, Text } from '@based/ui'
import { IntroSteps } from '../../Docs/IntroSteps'
import { useRoute } from 'kabouter'

export const Dashboard = () => {
  const route = useRoute('[section]')

  return (
    <styled.div
      style={{
        padding: '24px 48px',
        width: '100%',
        // maxWidth: 924,
        marginTop: 16,
      }}
    >
      <Row style={{ marginBottom: 42, alignItems: 'start', gap: 12 }}>
        <ShowEnvWidget />
        <ConnectionsWidget />
      </Row>

      <IntroSteps />
      <styled.div style={{ marginBottom: 16, marginTop: 64 }}>
        <Text size={14} weight="strong">
          Documentation
        </Text>
        <Text light style={{ marginBottom: 12 }}>
          Learn more about using the based-CMS.
        </Text>
        <Button
          color="system"
          size="small"
          onClick={() => route.setQuery({ section: 'docs' })}
        >
          Read Documentation
        </Button>
      </styled.div>
      {/* <Docs /> */}
    </styled.div>
  )
}
