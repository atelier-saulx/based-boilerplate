import React from 'react'
import { styled } from 'inlines'
import { Text, ScrollArea, Row, color, IconArrowLeft } from '@based/ui'
import { useRoute } from 'kabouter'
import { Description } from './Descriptions'
import { SetAndGet } from './SetAndGet'
import { Screenshots } from './Screenshots'
import { FieldOptions } from './FieldOptions'

export const FieldTemplate = ({ field }) => {
  const route = useRoute()

  return (
    <styled.div style={{ maxWidth: 824 }}>
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
            route.setQuery({ id: 'schema', field: null })
          }}
        >
          <IconArrowLeft style={{ marginRight: 8 }} />
          <Text weight="medium">Back</Text>
        </Row>
        <Row style={{ marginBottom: 32 }}>
          <Text weight="strong" size={24} style={{ marginRight: 12 }}>
            {field}
          </Text>
        </Row>
        <div style={{ marginBottom: 36 }}>
          <Text size={20} weight="strong" style={{ marginBottom: 12 }}>
            Description
          </Text>
          <Description field={field} />
        </div>

        <div style={{ marginBottom: 36 }}>
          <Text size={20} weight="strong" style={{ marginBottom: 12 }}>
            Screenshots
          </Text>
          <Screenshots field={field} />
        </div>

        <div style={{ marginBottom: 36 }}>
          <Text size={20} weight="strong" style={{ marginBottom: 12 }}>
            Field Options
          </Text>
          <FieldOptions field={field} />
        </div>

        <div style={{ marginBottom: 36 }}>
          <Text size={20} weight="strong" style={{ marginBottom: 12 }}>
            Set and Get your field
          </Text>
          <SetAndGet field={field} />
        </div>
      </ScrollArea>
    </styled.div>
  )
}
