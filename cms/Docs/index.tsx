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
  IconDevices,
  IconUsers,
  IconFunction,
} from '@based/ui'
import { SchemaDocs } from './SchemaDocs'
import { StartingDocs } from './StartingDocs'
import { ContentDocs } from './ContentDocs'

const StyledCard = styled('div', {
  alignItems: 'center',
  border: `1px solid ${color('inputBorder', 'neutralNormal', 'default')}`,
  // border: '1px solid transparent',
  borderRadius: 8,
  cursor: 'pointer ',
  display: 'inline-flex',
  flexDirection: 'column',
  margin: '1%',
  marginBottom: 12,
  padding: '12px',
  width: '23%',
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
    <StartingDocs />
  ) : section === 'docs' && id === 'schema' ? (
    <SchemaDocs />
  ) : section === 'docs' && id === 'content' ? (
    <ContentDocs />
  ) : (
    <styled.div style={{ gap: 16, padding: '48px 48px' }}>
      <StyledCard onClick={() => route.setQuery({ id: 'start-here' })}>
        <Thumbnail
          color="green"
          light
          outline
          icon={<IconHome />}
          style={{
            marginBottom: 12,
            cursor: 'pointer !important',
            borderRadius: '50%',
          }}
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
          style={{
            marginBottom: 12,
            cursor: 'pointer !important',
            borderRadius: '50%',
          }}
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
          style={{
            marginBottom: 12,
            cursor: 'pointer !important',
            borderRadius: '50%',
          }}
        />
        <Text size={16} weight="strong">
          Content
        </Text>
        <Text light>Learn all about content</Text>
      </StyledCard>
      <StyledCard onClick={() => route.setQuery({ id: 'connect' })}>
        <Thumbnail
          light
          outline
          color="brand"
          icon={<IconDevices />}
          style={{
            marginBottom: 12,
            cursor: 'pointer !important',
            borderRadius: '50%',
          }}
        />
        <Text size={16} weight="strong">
          Realtime Connections
        </Text>
        <Text light>Connecting to the frontend.</Text>
      </StyledCard>
      <StyledCard onClick={() => route.setQuery({ id: 'users' })}>
        <Thumbnail
          light
          outline
          color="magenta"
          icon={<IconUsers />}
          style={{
            marginBottom: 12,
            cursor: 'pointer !important',
            borderRadius: '50%',
          }}
        />
        <Text size={16} weight="strong">
          Users
        </Text>
        <Text light>All about User management.</Text>
      </StyledCard>
      <StyledCard onClick={() => route.setQuery({ id: 'users' })}>
        <Thumbnail
          light
          outline
          color="grape"
          icon={<IconFunction />}
          style={{
            marginBottom: 12,
            cursor: 'pointer !important',
            borderRadius: '50%',
          }}
        />
        <Text size={16} weight="strong">
          Based Functions
        </Text>
        <Text light>Create and deploy functions.</Text>
      </StyledCard>
    </styled.div>
  )
}
