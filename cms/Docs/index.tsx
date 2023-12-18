import React from 'react'
import { styled } from 'inlines'
import { useRoute } from 'kabouter'
import {
  IconHome,
  Text,
  Thumbnail,
  color,
  IconLayerThree,
  IconFileEdit,
} from '@based/ui'
import { SchemaDocs } from './SchemaDocs'

const StyledCard = styled('div', {
  padding: '12px',
  borderRadius: 8,
  cursor: 'pointer ',
  display: 'flex',
  flexDirection: 'column',
  width: '25%',
  alignItems: 'center',
  border: `1px solid ${color('inputBorder', 'neutralNormal', 'default')}`,
  '&:hover': {
    border: `1px solid ${color('content', 'brand')}`,
    backgroundColor: color('background', 'brand', 'surface'),
  },
})

export const Docs = () => {
  const route = useRoute('[section][id]')
  const section = route.query.section
  const id = route.query.id

  return section === 'docs' && id === 'start-here' ? (
    <div>start</div>
  ) : section === 'docs' && id === 'schema' ? (
    <SchemaDocs />
  ) : section === 'docs' && id === 'content' ? (
    <div>content</div>
  ) : (
    <styled.div style={{ display: 'flex', gap: 16, padding: '48px 48px' }}>
      <StyledCard onClick={() => route.setQuery({ id: 'start-here' })}>
        <Thumbnail
          color="green"
          light
          outline
          icon={<IconHome />}
          style={{ marginBottom: 12, cursor: 'pointer !important' }}
        />
        <Text size={16} weight="strong">
          Start here
        </Text>
        <Text light>If you are completely new</Text>
      </StyledCard>
      <StyledCard onClick={() => route.setQuery({ id: 'schema' })}>
        <Thumbnail
          light
          outline
          color="orange"
          icon={<IconLayerThree />}
          style={{ marginBottom: 12, cursor: 'pointer !important' }}
        />
        <Text size={16} weight="strong">
          Schema Fields
        </Text>
        <Text light>Learn all about the schema</Text>
      </StyledCard>
      <StyledCard onClick={() => route.setQuery({ id: 'content' })}>
        <Thumbnail
          light
          outline
          color="blue"
          icon={<IconFileEdit />}
          style={{ marginBottom: 12, cursor: 'pointer !important' }}
        />
        <Text size={16} weight="strong">
          Content
        </Text>
        <Text light>Learn all about content</Text>
      </StyledCard>
    </styled.div>
  )
}
