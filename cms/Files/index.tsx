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
  Modal,
  Input,
} from '@based/ui'
import { useClient, useQuery } from '@based/react'
import { Tile } from './Tile'
import { Explorer } from './Explorer'
import { CmsTable } from '../Components/CmsTable'
import { useRoute } from 'kabouter'

export const FileLibrary = () => {
  const client = useClient()
  const [table, setTable] = useState(false)
  const route = useRoute('[folder]')
  const path = route.query.folder as string
  if (!path) {
    route.setQuery({ folder: 'root' })
  }

  const { width, height } = useWindowResize()
  const [tableWidth, setTableWidth] = useState<number>(600)
  const [tableHeight, setTableHeight] = useState<number>(600)

  useEffect(() => {
    setTableWidth(width - 324)
    setTableHeight(height - 296)
  }, [width, height])

  return (
    <styled.div style={{ padding: '24px 48px', width: '100%' }}>
      <Modal.Root>
        <Row
          style={{
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 32,
          }}
        >
          <Text size={24} weight="strong" selectable="none">
            Files
            <Toggle
              value={!table}
              onChange={(v: any | string) => setTable(!v)}
            />
          </Text>
          <div>
            <Button
              onClick={async () => {
                await client.call('db:set', {
                  type: 'folder',
                  parents: ['root', path.split('/').slice(-1)[0]],
                })
              }}
              icon={<IconPlus />}
              ghost
              color="primary"
              size="small"
            >
              Add Folder
            </Button>
            <Modal.Trigger>
              <Button icon={<IconPlus />} ghost color="primary" size="small">
                Add File
              </Button>
            </Modal.Trigger>
          </div>
          <Modal.Content>
            {({ close }) => {
              return (
                <>
                  <Modal.Title>Upload File</Modal.Title>
                  <Modal.Body>
                    <Input type="file" onChange={close} />
                  </Modal.Body>
                  <Modal.Actions>
                    <Button color="system" onClick={close}>
                      Close
                    </Button>
                  </Modal.Actions>
                </>
              )
            }}
          </Modal.Content>
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
            <Explorer />
          )}
        </styled.div>
      </Modal.Root>
    </styled.div>
  )
}
