import React, { useState } from 'react'
import { styled } from 'inlines'
import {
  Avatar,
  Button,
  Dropdown,
  FormGroup,
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
import { ContentEditor } from '../Content/ContentEditor'

export const Management = () => {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [userValues, setUserValues] = useState<any>()
  const [userId, setUserId] = useState<any>()
  const { data, loading } = useQuery('db', {
    user: {
      status: true,
      name: true,
      id: true,
      email: true,
      createdAt: true,
      profileImg: true,
      //   $all: true,
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
  // const { data: user, loading: userLoading } = useQuery('db', {
  //   $id: userId,
  //   status: true,
  //   name: true,
  //   email: true,
  //   //   $all: true,
  //   createdAt: true,
  // })
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
        <Modal.Root>
          <styled.div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 36,
            }}
          >
            <Text size={24} weight="strong">
              User Management
            </Text>
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
          </styled.div>
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
        <Modal.Root>
          <Table
            columns={[
              { header: 'Email', key: 'email' },
              { header: 'ID', key: 'id', renderAs: 'badge' },
              { header: 'Name', key: 'name' },
              {
                header: 'Avatar',
                key: 'profileImg',
                renderAs: 'avatar',
              },
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
                      <Modal.Trigger>
                        <Button
                          // style={{ width: '100%' }}
                          icon={<IconEdit />}
                          size="xsmall"
                          onClick={() => setUserId(row)}
                        >
                          Edit
                        </Button>
                      </Modal.Trigger>

                      <Dropdown.Separator />
                      <Modal.Root>
                        <Modal.Trigger>
                          <Button icon={<IconDelete />} size="xsmall">
                            Delete
                          </Button>
                        </Modal.Trigger>
                        <Modal.Confirmation
                          title="Delete User"
                          action={{
                            action: async () => {
                              client.call('db:delete', {
                                $id: row.id,
                              })
                            },
                            label: 'Confirm',
                          }}
                          description={`Are you sure you want to delete the user: ${row.email}`}
                          label="This action is irreversible"
                          type="alert"
                        />
                      </Modal.Root>
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
          <Modal.Content>
            {({ close }) => {
              return (
                <>
                  <Modal.Title>Edit {userId?.id}</Modal.Title>
                  <Modal.Body>
                    <FormGroup
                      values={{ ...userId, ...userValues }}
                      config={{
                        status: { type: 'string' },
                        name: { type: 'string' },
                        email: { type: 'string' },
                        createdAt: {
                          type: 'number',
                          meta: { readOnly: true },
                        },
                      }}
                      alwaysAccept
                      onChange={(v) => setUserValues({ ...userValues, ...v })}
                    />
                  </Modal.Body>
                  <Modal.Actions>
                    <Button
                      color="neutral"
                      light
                      onClick={close}
                      displayShortcut
                      keyboardShortcut="Esc"
                    >
                      Cancel
                    </Button>
                    <Button
                      displayShortcut
                      keyboardShortcut="Enter"
                      onClick={async () => {
                        client
                          .call('db:set', {
                            $id: userId.id,
                            ...userId,
                            ...userValues,
                          })
                          .then(() => close())
                      }}
                    >
                      Confirm
                    </Button>
                  </Modal.Actions>
                </>
              )
            }}
          </Modal.Content>
        </Modal.Root>
      </div>
    </styled.div>
  )
}
