import React from 'react'
import {
  Row,
  Column,
  Thumbnail,
  Text,
  IconLayerThree,
  IconFileEdit,
  IconDesktop,
} from '@based/ui'

export const IntroSteps = () => {
  return (
    <Row style={{ justifyContent: 'space-between', gap: 24, marginBottom: 42 }}>
      <Column
        style={{ justifyContent: 'center', alignItems: 'center', gap: 12 }}
      >
        <Thumbnail
          icon={<IconLayerThree />}
          light
          outline
          style={{ borderRadius: '50%' }}
        />
        <Text size={16} weight="strong">
          1. Setup your schema
        </Text>
        <Text light align="center">
          Add Fields to your schematypes with our SchemaBuilder.
        </Text>
      </Column>

      <Column
        style={{ justifyContent: 'center', alignItems: 'center', gap: 12 }}
      >
        <Thumbnail
          color="magenta"
          icon={<IconFileEdit />}
          light
          outline
          style={{ borderRadius: '50%' }}
        />
        <Text size={16} weight="strong">
          2. Add Content
        </Text>
        <Text light align="center">
          Fill & View your schema-type-fields with content.
        </Text>
      </Column>

      <Column
        style={{ justifyContent: 'center', alignItems: 'center', gap: 12 }}
      >
        <Thumbnail
          color="green"
          icon={<IconDesktop />}
          light
          outline
          style={{ borderRadius: '50%' }}
        />
        <Text size={16} weight="strong">
          3. Connect Realtime
        </Text>
        <Text align="center" light>
          Connect your content to your app/ website.
        </Text>
      </Column>
    </Row>
  )
}
