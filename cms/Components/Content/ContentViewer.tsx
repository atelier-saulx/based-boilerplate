import React, { useEffect } from 'react'
import {
  Table,
  Dropdown,
  Modal,
  useInfiniteQuery,
  Button,
  IconMoreVertical,
  IconCopy,
  IconPlus,
  IconDelete,
  Page,
  Stack,
  Text,
} from '@based/ui'
import { useRoute } from 'kabouter'
import { useClient } from '@based/react'

export const ContentViewer = ({ selectedLang, section }) => {
  const route = useRoute('[section][id]')

  const client = useClient()

  const [itemToDelete, setItemToDelete] = React.useState(null)

  const { data, fetchMore, setVisibleElements } = useInfiniteQuery({
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
              $operator: '=',
              $field: 'type',
              $value: section,
            },
          },
        },
      },
    }),
  })

  console.log(data, '🐧', selectedLang)

  return (
    <Page>
      <Stack style={{ marginBottom: 24 }}>
        <Text variant="title-page">{section as string}</Text>

        <Button
          prefix={<IconPlus />}
          size="small"
          variant="primary-transparent"
          onClick={async () => {
            await client.call('db:set', {
              // TODO check this ? en default?
              $language: selectedLang,
              type: section,
            })
          }}
        >
          Add new {section as string}
        </Button>
      </Stack>

      <Table
        data={data}
        onScrollToBottom={fetchMore}
        onVisibleElementsChange={setVisibleElements}
        onRowClick={(row) => route.setQuery({ id: row.id })}
        rowAction={(row) => (
          <Dropdown.Root>
            <Dropdown.Trigger>
              <Button shape="square" variant="neutral-transparent">
                <IconMoreVertical />
              </Button>
            </Dropdown.Trigger>
            <Dropdown.Items>
              <Dropdown.Item icon={<IconCopy />}>Copy</Dropdown.Item>
              <Dropdown.Item
                icon={<IconDelete />}
                onClick={() => {
                  setItemToDelete(row.id)
                }}
              >
                Delete
              </Dropdown.Item>
            </Dropdown.Items>
          </Dropdown.Root>
        )}
      />

      {itemToDelete && (
        <Modal.Root
          open
          onOpenChange={() => {
            setItemToDelete(null)
          }}
        >
          <Modal.Overlay>
            {({ close }) => (
              <>
                <Modal.Title description="Are you sure? This action cannot be undone.">
                  Deleting item #{itemToDelete}
                </Modal.Title>
                <Modal.Actions>
                  <Button onClick={close} variant="neutral">
                    Cancel
                  </Button>
                  <Button onClick={close} variant="error">
                    Delete
                  </Button>
                </Modal.Actions>
              </>
            )}
          </Modal.Overlay>
        </Modal.Root>
      )}
    </Page>
  )
}
