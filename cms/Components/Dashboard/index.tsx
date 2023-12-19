import React from 'react'
import { styled } from 'inlines'
import { ShowEnvWidget } from './ShowEnvWidget'
import { ConnectionsWidget } from './ConnectionsWidget'
import { Button, Row, Text, Column, color } from '@based/ui'
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
      <IntroSteps />
      <styled.div
        style={{
          marginBottom: 42,
          marginTop: 64,
          paddingLeft: 16,
          borderLeft: `2px solid ${color(
            'inputBorder',
            'neutralNormal',
            'default'
          )}`,
        }}
      >
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
      <Column style={{ maxWidth: 324 }}>
        <ConnectionsWidget />
        <ShowEnvWidget />
      </Column>
      {/* <Docs /> */}
    </styled.div>
  )
}
