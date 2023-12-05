import React, { useState, useEffect } from 'react'
import { styled } from 'inlines'
import {
  Row,
  Text,
  Button,
  IconPlus,
  Table,
  useInfiniteQuery,
  useWindowResize,
} from '@based/ui'
import { useClient, useQuery } from '@based/react'
import { CmsTable } from '../Components/CmsTable'

export const FileLibrary = () => {
  const client = useClient()

  const { width, height } = useWindowResize()
  const [tableWidth, setTableWidth] = useState<number>(600)
  const [tableHeight, setTableHeight] = useState<number>(600)

  useEffect(() => {
    setTableWidth(width - 324)
    setTableHeight(height - 296)
  }, [width, height])

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
        </Text>
        <Button icon={<IconPlus />} ghost color="primary" size="small">
          Add File
        </Button>
      </Row>
      <styled.div>
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
      </styled.div>
    </styled.div>
  )
}
