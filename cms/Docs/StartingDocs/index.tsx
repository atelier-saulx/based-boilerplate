import React from 'react'
import { styled } from 'inlines'
import { useRoute } from 'kabouter'
import { ScrollArea, Row, color, IconArrowLeft, Text } from '@based/ui'

export const StartingDocs = () => {
  const route = useRoute()
  return (
    <styled.div>
      <ScrollArea style={{ padding: '24px 48px', width: '100%' }}>
        <Row
          style={{
            cursor: 'pointer',
            marginBottom: 6,
            width: '72px',
            '&:hover div': {
              color: `${color('content', 'brand')} !important`,
            },
          }}
          onClick={() => {
            // @ts-ignore
            route.setQuery({ id: null })
          }}
        >
          <IconArrowLeft style={{ marginRight: 8 }} />
          <Text weight="medium">Back</Text>
        </Row>
        <Row style={{ marginBottom: 32 }}>
          <Text weight="strong" size={24} style={{ marginRight: 12 }}>
            Getting Started.
          </Text>

          <Text>Setting up your schema</Text>
          <Text>
            First you want to set up a schema. You can start building your
            custom schema using any of these fields.
          </Text>
        </Row>
      </ScrollArea>
    </styled.div>
  )
}
