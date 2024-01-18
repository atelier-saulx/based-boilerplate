import React, { useState } from 'react'
import { useQuery } from '@based/react'
import { Form, Page, Stack, Text } from '@based/ui'

export const ContentEditor = ({ id, section }) => {
  const { data, loading } = useQuery('db', {
    $id: id,
    $all: true,
  })

  const { data: schema, loading: loadingSchema } = useQuery('db:schema')

  const [formFieldChanges, setFormFieldChanges] = useState({})

  console.log(data, '💂🏻‍♀️', section)
  let schemaFields = schema?.types[section].fields

  return (
    <Page>
      <Stack style={{ marginBottom: 24 }}>
        <Text variant="title-modal">
          {section}/{id}
        </Text>
      </Stack>
      <Form
        values={{ ...data, ...formFieldChanges }}
        fields={schemaFields}
        onChange={(v) => {
          console.log(v, '🐋')
          //   setSomeThingChanged(true)
          setFormFieldChanges({ ...formFieldChanges, ...v })
        }}
      />
    </Page>
  )
}
