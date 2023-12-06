import React, { useState, useEffect } from 'react'
import { styled } from 'inlines'
import {
  Row,
  Text,
  Button,
  IconPlus,
  useWindowResize,
  Toggle,
  useInfiniteQuery,
} from '@based/ui'
import { useClient, useQuery } from '@based/react'
import { Tile } from './Tile'
import { Explorer } from './Explorer'
import { CmsTable } from '../Components/CmsTable'

export const FileLibrary = () => {
  const client = useClient()
  const [table, setTable] = useState(false)

  const { width, height } = useWindowResize()
  const [tableWidth, setTableWidth] = useState<number>(600)
  const [tableHeight, setTableHeight] = useState<number>(600)

  useEffect(() => {
    setTableWidth(width - 324)
    setTableHeight(height - 296)
  }, [width, height])

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
      <styled.div>
        {table ? (
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
              $value: 'file',
            }}
            // queryId forces a rerender // subscription
            queryId={'file' as string}
            //  onRowClick={(row) => route.setQuery({ id: row.id })}
            //  columnNamesInRightOrder={arr}
          />
        ) : (
          <Explorer data={data} />
        )}
      </styled.div>
    </styled.div>
  )
}
