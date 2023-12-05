import React, { useState, useEffect } from 'react'
import { styled } from 'inlines'
import { Button, FormGroup, IconPlus, Input, Modal, Row, Text } from '@based/ui'
import { useClient, useQuery } from '@based/react'
import { useWindowResize } from '@based/ui'
import { CmsTable } from '../Components/CmsTable'

export const Management = () => {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [userValues, setUserValues] = useState<any>()
  const [userId, setUserId] = useState<any>()
  const [openEditUserModal, setOpenEditUserModal] = useState(false)

  const { width, height } = useWindowResize()
  const [tableWidth, setTableWidth] = useState<number>(600)
  const [tableHeight, setTableHeight] = useState<number>(600)

  useEffect(() => {
    setTableWidth(width - 324)
    setTableHeight(height - 296)
  }, [width, height])

  const client = useClient()

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
          Users
        </Text>
        <Modal.Root>
          <Modal.Trigger>
            <Button
              icon={<IconPlus />}
              size="small"
              ghost
              color="primary"
              onClick={() => {}}
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
            $value: 'user',
          }}
          // queryId forces a rerender // subscription
          queryId={'user' as string}
          onRowClick={(row) => {
            setUserId(row)
            setOpenEditUserModal(true)
          }}
        />
      </styled.div>

      <Modal.Root open={openEditUserModal} onOpenChange={setOpenEditUserModal}>
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
    </styled.div>
  )
}
