import React, { useState } from 'react'
import { styled } from 'inlines'
import { useClient, useQuery } from '@based/react'
import {
  Text,
  Badge,
  Row,
  FormGroup,
  scrollAreaStyle,
  IconArrowLeft,
  color,
  ScrollArea,
} from '@based/ui'
import { PublishSideBar } from './PublishSideBar'
import { useRoute } from 'kabouter'

const FILTER_FIELDS = ['type', 'ancestors', 'descendants', 'id', 'aliases']

export const ContentEditor = ({ id, section }) => {
  const [formFieldChanges, setFormFieldChanges] = useState({})
  const [someThingChanged, setSomeThingChanged] = useState(false)
  const client = useClient()

  const { data, loading } = useQuery('db', {
    $id: id,
    $all: true,
  })

  const { data: schema, loading: loadingSchema } = useQuery('db:schema')
  console.log(data)

  const route = useRoute('[section][id]')

  // filter out some system fields
  let schemaFields = schema?.types[section].fields
  let filteredSchemaFields = {}
  if (schema) {
    for (const [key, value] of Object.entries(schemaFields)) {
      if (!FILTER_FIELDS.includes(key)) {
        filteredSchemaFields[key] = value
      }
    }
  }

  return (
    <styled.div
      style={{
        width: '100%',
        display: 'flex',
        height: 'calc(100vh - 67px)',
      }}
    >
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
            setSomeThingChanged(false)
          }}
        >
          <IconArrowLeft style={{ marginRight: 8 }} />
          <Text weight="medium">Back</Text>
        </Row>
        <Row style={{ marginBottom: 32 }}>
          <Text weight="strong" size={24} style={{ marginRight: 12 }}>
            {section}
          </Text>
          <Badge light>{id}</Badge>
        </Row>
        {schema && (
          <FormGroup
            alwaysAccept
            config={filteredSchemaFields}
            onChange={(v) => {
              setSomeThingChanged(true)
              setFormFieldChanges({ ...formFieldChanges, ...v })
            }}
            values={{ ...data, ...formFieldChanges }}
          />
        )}
      </ScrollArea>
      <PublishSideBar
        someThingChanged={someThingChanged}
        setSomeThingChanged={setSomeThingChanged}
        updatedAt={data?.updatedAt}
        onClick={async () => {
          console.log('asdfasdf', { ...data, ...formFieldChanges })
          await client
            .call('db:set', {
              $id: id,
              ...data,
              ...formFieldChanges,
            })
            .catch((err) => console.log(err))
        }}
      />
    </styled.div>
  )
}
