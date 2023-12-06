import React, { useState } from 'react'
import { styled } from 'inlines'
import {
  Row,
  Text,
  Button,
  IconPlus,
  Table,
  useInfiniteQuery,
  Toggle,
} from '@based/ui'
import { useClient, useQuery } from '@based/react'
import { Tile } from './Tile'
import { Explorer } from './Explorer'

export const FileLibrary = () => {
  // const client = useClient()
  const [table, setTable] = useState(false)

  const [filter, setFilter] = useState({
    operator: '=',
    field: 'type',
    value: 'file',
  })

  const { data, fetchMore, setVisibleElements, filterChange } =
    useInfiniteQuery(
      {
        accessFn: (data) => data.files,
        queryFn: (offset) => ({
          $id: 'root',
          files: {
            $all: true,
            $list: {
              $sort: { $field: 'updatedAt', $order: 'desc' },
              $offset: offset,
              $limit: 25,
              $find: {
                $traverse: 'children',
                $filter: {
                  $operator: filter?.operator,
                  $field: filter?.field,
                  $value: filter?.value,
                },
              },
            },
          },
        }),
      }

      // , [filter]
    )

  console.log(data)

  return (
    <styled.div style={{ padding: '24px 48px', width: '100%' }}>
      <Row
        style={{
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 32,
        }}
      >
        <Text size={24} weight="strong">
          Files
          <Toggle value={!table} onChange={(v: any | string) => setTable(!v)} />
        </Text>
        <Button icon={<IconPlus />} ghost color="primary" size="small">
          Add File
        </Button>
      </Row>
      <styled.div style={{ maxWidth: 854 }}>
        {table ? (
          <Table
            data={data}
            topBar
            onVisibleElementsChange={setVisibleElements}
            onScrollToBottom={() => {
              fetchMore()
            }}
            onFilterChange={(v) => {
              if (v) {
                setFilter(v)
                filterChange()
              }
            }}
          />
        ) : (
          <Explorer data={data} />
        )}
      </styled.div>
    </styled.div>
  )
}
