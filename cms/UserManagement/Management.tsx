import React, { useState } from 'react'
import { styled } from 'inlines'
import {
  Button,
  Dropdown,
  IconDelete,
  IconEdit,
  IconMoreHorizontal,
  IconPlus,
  Input,
  Modal,
  Table,
  Text,
} from '@based/ui'
import { useClient, useQuery } from '@based/react'

export const Management = () => {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const { data, loading } = useQuery('db', {
    user: {
      status: true,
      name: true,
      id: true,
      email: true,
      //   $all: true,
      createdAt: true,
      $list: {
        $find: {
          $traverse: 'children',
          $filter: {
            $field: 'type',
            $operator: '=',
            $value: 'user',
          },
        },
      },
    },
  })
  const client = useClient()

  console.log(data?.user)

  return (
    <styled.div
      style={{
        display: 'flex',
        width: '100%',
        paddingTop: 90,
        // alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ width: 900, height: 400 }}>
        <Text size={48}>User Management</Text>
        <Modal.Root>
          <Modal.Trigger>
            <Button
              icon={<IconPlus />}
              size="small"
              onClick={async () => {
                // await client.call('db:set', {
                //   // TODO check this ? en default?
                //   $language: 'en',
                //   type: routeSection,
                // })
              }}
            >
              Add new User
            </Button>
          </Modal.Trigger>
          <Modal.Content>
            {({ close }) => {
              return (
                <>
                  <Modal.Title>Invite new user</Modal.Title>
                  <Modal.Body>
                    <Input
                      type="text"
                      label="Email"
                      onChange={(v) => setEmail(v)}
                    />
                    <Input
                      type="text"
                      label="Name"
                      onChange={(v) => setName(v)}
                    />
                  </Modal.Body>
                  <Modal.Actions>
                    <Button onClick={close}>Cancel</Button>
                    <Button
                      onClick={async () =>
                        client.call('register', { name, email })
                      }
                    >
                      Confirm
                    </Button>
                  </Modal.Actions>
                </>
              )
            }}
          </Modal.Content>
        </Modal.Root>
        <Table
          columns={[
            { header: 'ID', key: 'id', renderAs: 'badge' },
            { header: 'Name', key: 'name' },
            { header: 'Email', key: 'email' },
            {
              header: 'Created',
              key: 'createdAt',
              renderAs: 'date-time-human',
            },
            {
              id: 'actions',
              align: 'end',
              renderAs: (row) => (
                <Dropdown.Root>
                  <Dropdown.Trigger>
                    <Button ghost icon={<IconMoreHorizontal />} />
                  </Dropdown.Trigger>
                  <Dropdown.Items>
                    <Dropdown.Item
                      //   onClick={() => {
                      //     setOpen(row.id)
                      //   }}
                      icon={<IconEdit />}
                    >
                      Edit
                    </Dropdown.Item>
                    <Dropdown.Separator />
                    <Dropdown.Item
                      icon={<IconDelete />}
                      onClick={async () => {
                        client.call('db:delete', {
                          $id: row.id,
                        })
                      }}
                    >
                      Delete
                    </Dropdown.Item>
                  </Dropdown.Items>
                </Dropdown.Root>
              ),
            },
          ]}
          onRowClick={(e) => console.log(e)}
          header="sticky"
          virtualized={false}
          border={true}
          data={data?.user}
        />
      </div>
    </styled.div>
  )
}
