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

    const exampleById = `
    import { useQuery } from '@based/react
    
    const { data: result } = useQuery('db', {
      $id: '20efb82d70',
      fieldname: true,
    })
    `

    const getExampleOne = `import { useQuery } from '@based/react'

    const { data: result } = useQuery('db', {
      $id: 'root',
      children: {
        $all: true,
        $list: {
          $find: {
            $traverse: 'children',
            $filter: {
              $field: 'type',
              $operator: '=',
              $value: 'SchemaType',
            },
          },
        },
      },
    })

    // result is children -> array of schemaTypes objects
    console.log(result)
    `

    const getExampleTwo = `
    import { useQuery } from '@based/react'

    const { data: schema, loading: loadingSchema } = useQuery('db:schema', {})

    console.log('complete schema', schema)
    `

    return (
      <>
        <Text style={{ marginBottom: 8 }}>
          Setting a string in your schema type:
        </Text>
        <Code
          defaultValue={exampleString}
          color="informative"
          style={{ marginBottom: 24 }}
        />

        <Text style={{ marginBottom: 8 }}>
          A way of retrieving your content in your app/website. Query all the
          field with type 'SchemaType':
        </Text>
        <Code
          defaultValue={getExampleOne}
          color="informative"
          style={{ marginBottom: 24 }}
        />

        <Text style={{ marginBottom: 8 }}>
          If you know the ID of the specific content your field is in:
        </Text>
        <Code
          defaultValue={exampleById}
          color="informative"
          style={{ marginBottom: 24 }}
        />

        <Text style={{ marginBottom: 8 }}>
          Another way of retrieving is loading the complete schema and go from
          there. This is less performant, but gives you an overview of
          everything in the schema:
        </Text>
        <Code
          defaultValue={getExampleTwo}
          color="informative"
          style={{ marginBottom: 24 }}
        />
      </>
    )
  }

  if (field === 'Text') {
    return <></>
  }
  if (field === 'Rich Text') {
    return <>xx</>
  }
  if (field === 'Number') {
    const exampleNum = JSON.stringify(
      {
        fieldname: {
          id: 'fieldname',
          type: 'number',
          index: 3,
          meta: {},
        },
      },
      null,
      2
    )

    return (
      <>
        <Text style={{ marginBottom: 8 }}>
          Setting a number in your schema type:
        </Text>
        <Code
          defaultValue={exampleNum}
          color="informative"
          style={{ marginBottom: 24 }}
        />
      </>
    )
  }
  if (field === 'Int') {
    return <></>
  }
  if (field === 'Enum') {
    return <></>
  }
  if (field === 'Boolean') {
    return <></>
  }
  if (field === 'Timestamp') {
    return <></>
  }
  if (field === 'Array') {
    return <></>
  }
  if (field === 'Object') {
    return <></>
  }
  if (field === 'Record') {
    return <></>
  }
  if (field === 'Set') {
    return <></>
  }
  if (field === 'JSON') {
    return <></>
  }
  if (field === 'Reference') {
    return <></>
  }
  if (field === 'References') {
    return <></>
  }
  if (field === 'Cardinality') {
    return <></>
  }
}
