import React from 'react'
import { Text, Code } from '@based/ui'

export const SetAndGet = ({ field }) => {
  if (field === 'String') {
    const exampleString = JSON.stringify(
      {
        schemaType: {
          fields: {
            fieldname: {
              id: 'fieldname',
              type: 'string',
              index: 1,
              meta: {},
            },
          },
        },
      },
      null,
      2
    )

    return (
      <>
        <Text style={{ marginBottom: 8 }}>
          Setting a string in your schema type:
        </Text>
        <Code defaultValue={exampleString} color="informative" />
      </>
    )
  }
}
