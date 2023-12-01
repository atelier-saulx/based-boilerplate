import React, { useState } from 'react'
import { styled } from 'inlines'
import { useClient, useQuery } from '@based/react'
import { Text, Badge, Row, FormGroup } from '@based/ui'
import { PublishSideBar } from './PublishSideBar'

const FILTER_FIELDS = ['type', 'ancestors', 'descendants', 'id', 'aliases']

export const ContentEditor = ({ id, section }) => {
  const [formFieldChanges, setFormFieldChanges] = useState({})
  const client = useClient()

  const { data, loading } = useQuery('db', {
    $id: id,
    $all: true,
  })

  const { data: schema, loading: loadingSchema } = useQuery('db:schema')

  console.log('🙀', data, loading)

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
    <styled.div style={{ width: '100%', display: 'flex' }}>
      <styled.div style={{ padding: '24px 48px', width: '100%' }}>
        <Row style={{ marginBottom: 32 }}>
          <Text weight="strong" size={24} style={{ marginRight: 12 }}>
            {section}
          </Text>
          <Badge light>{id}</Badge>
        </Row>
        {schema && (
          <FormGroup
            alwaysAccept
            onChange={(v) => setFormFieldChanges({ ...formFieldChanges, ...v })}
            config={filteredSchemaFields}
            values={{ ...data, ...formFieldChanges }}
          />
        )}
      </styled.div>
      <PublishSideBar
        updatedAt={data?.updatedAt}
        onClick={async () => {
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

// onChange={(v) => {
//   console.log('hellow wtap?', v)

// }}
