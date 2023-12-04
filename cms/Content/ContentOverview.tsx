import React, { useEffect, useState } from 'react'
import { styled } from 'inlines'
import { Text, Row, Button, IconPlus } from '@based/ui'
import { useClient, useQuery } from '@based/react'
import { useRoute } from 'kabouter'
import { CmsTable } from '../Components/CmsTable'

export const ContentOverview = () => {
  const client = useClient()
  const { data: schema, loading: loadingSchema } = useQuery('db:schema')

  const route = useRoute('[section][id]')
  const routeSection = route.query.section

  // TODO: ordering columns based on index

  let arr: string[] = []
  if (schema) {
    // console.log(Object.values(schema?.types[routeSection as string].fields))
    let fields = Object.values(schema?.types[routeSection as string].fields)

    console.log(schema?.types[routeSection as string].fields, 'thiese 👾')

    let realFields = Object.entries(
      schema?.types[routeSection as string].fields
    )

    console.log(realFields, 'flio')

    let sortedByMetaIndex = realFields.sort(
      (p1: any, p2: any) => p1[1]?.meta?.index - p2[1]?.meta?.index
    )

    for (let i = 0; i < sortedByMetaIndex.length; i++) {
      arr.push(sortedByMetaIndex[i][0] as string)
    }
    //  orderedArray.sort((a, b) => a?.index - b?.index)
    console.log('in right order?', sortedByMetaIndex)
  }

  console.log(arr, 'ARRR')
  // useEffect(() => {
  //   setColumnNamesInRightOrder(arr)
  // }, [arr?.length])

  return (
    <styled.div style={{ padding: '24px 48px', width: '100%' }}>
      <Row
        style={{
          marginBottom: 32,
          justifyContent: 'space-between',
          maxWidth: 900,
        }}
      >
        <Row>
          <Text size={24} weight="strong">
            {schema?.types[routeSection as string]?.meta?.pluralName ||
              routeSection}
          </Text>
        </Row>
        <Button
          icon={<IconPlus />}
          size="small"
          color="primary"
          ghost
          onClick={async () => {
            await client.call('db:set', {
              // TODO check this ? en default?
              $language: 'en',
              type: routeSection,
            })
          }}
        >
          Add new {routeSection as string}
        </Button>
      </Row>
      {schema?.types[routeSection as string]?.meta?.description && (
        <Text light style={{ marginTop: '-12px', marginBottom: 16 }}>
          {schema?.types[routeSection as string]?.meta?.description}
        </Text>
      )}

      <styled.div>
        <CmsTable
          width={900}
          height={600}
          query={(offset, limit, sortOptions, filter) => {
            return client.query('db', {
              $id: 'root',
              children: {
                $all: true,
                $list: {
                  $sort: sortOptions,
                  $offset: offset,
                  $limit: 25,
                  $find: {
                    $filter: filter,
                  },
                },
              },
            })
          }}
          getQueryItems={(d) => {
            return d.children
          }}
          filter={{
            $operator: '=',
            $field: 'type',
            $value: routeSection as string,
          }}
          // queryId forces a rerender // subscription
          queryId={routeSection as string}
          onRowClick={(row) => route.setQuery({ id: row.id })}
          columnNamesInRightOrder={arr}
        />
      </styled.div>
    </styled.div>
  )
}
