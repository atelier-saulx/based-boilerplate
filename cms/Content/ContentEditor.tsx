import React, { useState } from 'react'
import { styled } from 'inlines'
import { useClient, useQuery } from '@based/react'
import { color, ScrollArea } from '@based/ui'
import { PublishSideBar } from './PublishSideBar'
import { useRoute } from 'kabouter'
import { Text, Badge, Stack, IconArrowLeft, Form } from 'better-ui'

const FILTER_FIELDS = [
  'type',
  'ancestors',
  'descendants',
  'id',
  'aliases',
  'createdAt',
  'parents',
  'updatedBy',
  'updatedAt',
  'children',
]

export const ContentEditor = ({ id, section }) => {
  const [formFieldChanges, setFormFieldChanges] = useState({})
  const [someThingChanged, setSomeThingChanged] = useState(false)
  const client = useClient()

  const { data: userData } = useQuery('db', {
    $id: client.authState.userId,
    name: true,
  })

  const { data, loading } = useQuery('db', {
    $id: id,
    $all: true,
  })

  const { data: schema, loading: loadingSchema } = useQuery('db:schema')

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
        <Stack
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
          <IconArrowLeft />
          <Text variant="bodyBold">Back</Text>
        </Stack>
        <Stack style={{ marginBottom: 32 }}>
          <Text
            variant="bodyStrong"
            as="h3"
            style={{ marginRight: 12, fontSize: 24 }}
          >
            {section}
          </Text>
          <Badge color="auto-muted" copyValue={id}>
            {id}
          </Badge>
        </Stack>
        {schema && (
          // <FormGroup
          //   alwaysAccept
          //   config={filteredSchemaFields}
          //   onChange={(v) => {
          //     setSomeThingChanged(true)
          //     setFormFieldChanges({ ...formFieldChanges, ...v })
          //   }}
          //   values={{ ...data, ...formFieldChanges }}
          // />

          <Form
            values={{ ...data, ...formFieldChanges }}
            fields={schemaFields}
            onChange={(v) => {
              console.log(v, '🐋')
              setSomeThingChanged(true)
              setFormFieldChanges({ ...formFieldChanges, ...v })
            }}
          />
        )}
      </ScrollArea>
      <PublishSideBar
        someThingChanged={someThingChanged}
        setSomeThingChanged={setSomeThingChanged}
        updatedAt={data?.updatedAt}
        updatedBy={data?.updatedBy}
        onClick={async () => {
          // console.log('asdfasdf 🐝', {
          //   ...data,
          //   ...formFieldChanges,
          //   updatedBy: userData.name,
          // })

          // TODO updatedBy can be meta data from updatedAt @yves

          if (Object.keys(schemaFields).includes('updatedBy')) {
            await client
              .call('db:set', {
                $id: id,
                ...data,
                ...formFieldChanges,
                updatedBy: userData.name,
              })
              .catch((err) => console.log(err))
          } else {
            await client
              .call('db:set', {
                $id: id,
                ...data,
                ...formFieldChanges,
              })
              .catch((err) => console.log(err))
          }
        }}
      />
    </styled.div>
  )
}
