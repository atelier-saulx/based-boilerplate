import React from 'react'
import { styled } from 'inlines'
import {
  Row,
  ScrollArea,
  color,
  IconArrowLeft,
  Text,
  Thumbnail,
  Column,
} from '@based/ui'
import { useRoute } from 'kabouter'
import { SCHEMA_FIELDS } from '../../Schema/AddField'
import { FieldTemplate } from './FieldTemplate'

const StyledCard = styled('div', {
  padding: '12px',
  borderRadius: 8,
  cursor: 'pointer ',
  display: 'inline-block',
  marginBottom: 12,
  // flexDirection: 'column',
  width: '30%',
  marginRight: '2%',
  //   alignItems: 'center',
  border: `1px solid ${color('inputBorder', 'neutralNormal', 'default')}`,
  '&:hover': {
    border: `1px solid ${color('content', 'brand')}`,
    backgroundColor: color('background', 'brand', 'surface'),
  },
})

export const SchemaDocs = () => {
  const route = useRoute()
  const field = route.query.field

  console.log('field??', field)

  return !field ? (
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
            Schema Types & Fields.
          </Text>
        </Row>
        <Text style={{ marginBottom: 32 }} size={16} light>
          You can build your custom schema using any of these fields.
        </Text>
        <styled.div style={{}}>
          {SCHEMA_FIELDS.map((item, idx) => (
            <StyledCard
              key={idx}
              onClick={() => route.setQuery({ field: item.label })}
            >
              <Row>
                <Thumbnail
                  icon={item.icon}
                  light
                  color={item.color as any}
                  style={{ marginRight: 16 }}
                />
                <Column>
                  <Text weight="strong">{item.label}</Text>
                  <Text light style={{ lineHeight: '16px' }}>
                    {item.description}
                  </Text>
                </Column>
              </Row>
            </StyledCard>
          ))}
        </styled.div>
      </ScrollArea>
    </styled.div>
  ) : (
    <FieldTemplate field={field} />
  )
}
