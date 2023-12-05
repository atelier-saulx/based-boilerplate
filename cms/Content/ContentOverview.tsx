import React, { useRef, useEffect, useState } from 'react'
import { styled } from 'inlines'
import { Text, Row, Button, IconPlus } from '@based/ui'
import { useClient, useQuery } from '@based/react'
import { useRoute } from 'kabouter'
import { CmsTable } from '../Components/CmsTable'
import { useWindowResize } from '../hooks/useWindowResize'

export const ContentOverview = () => {
  const client = useClient()
  const { data: schema, loading: loadingSchema } = useQuery('db:schema')

  const route = useRoute('[section][id]')
  const routeSection = route.query.section

  const { width, height } = useWindowResize()

  const [tableWidth, setTableWidth] = useState<number>(600)
  const [tableHeight, setTableHeight] = useState<number>(600)

  const tableWrapperContainerRef = useRef<HTMLDivElement>()

  let arr: string[] = []
  if (schema) {
    let realFields = Object.entries(
      schema?.types[routeSection as string].fields
    )

    let sortedByMetaIndex = realFields.sort(
      (p1: any, p2: any) => p1[1]?.meta?.index - p2[1]?.meta?.index
    )

    for (let i = 0; i < sortedByMetaIndex.length; i++) {
      arr.push(sortedByMetaIndex[i][0] as string)
    }
  }

  useEffect(() => {
    if (tableWrapperContainerRef.current) {
      setTableWidth(width - 324)
      setTableHeight(height - 296)
    }
  }, [width, height])

  return (
    <styled.div style={{ padding: '24px 48px', width: '100%' }}>
      <Row
        style={{
          marginBottom: 32,
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <Row>
          <Text size={24} weight="strong">
            {schema?.types[routeSection as string]?.meta?.displayName ||
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
      <styled.div ref={tableWrapperContainerRef}>
        <CmsTable
          width={tableWidth}
          height={tableHeight}
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
