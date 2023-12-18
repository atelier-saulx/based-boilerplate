import React from 'react'
import { styled } from 'inlines'
import { Row, ScrollArea, color, IconArrowLeft, Text, Badge } from '@based/ui'
import { useRoute } from 'kabouter'

export const SchemaDocs = () => {
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
            Schema Types & Fields
          </Text>
        </Row>
        <Text>Paragraph here</Text>
        <styled.div>Grid with fieldtypes here</styled.div>
      </ScrollArea>
    </styled.div>
  )
}
