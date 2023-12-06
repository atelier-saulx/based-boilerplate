import React, { useState, useEffect } from 'react'
import { styled } from 'inlines'
import {
  Row,
  Text,
  Button,
  IconArrowLeft,
  Dropdown,
  IconMoreHorizontal,
  IconEdit,
  IconDelete,
  IconCopy,
  Modal,
  Input,
} from '@based/ui'
import { SchemaSidebar } from './SchemaSidebar'
import { useRoute } from 'kabouter'
import { SchemaFields } from './SchemaFields'
import { useQuery, useClient } from '@based/react'
import { AddField } from './AddField'

export const SchemaBuilder = () => {
  // Modal States
  const [openEditModal, setOpenEditModal] = useState(false)
  const [typeName, setTypeName] = useState('')
  const [pluralName, setPluralName] = useState('')
  const [description, setDescription] = useState('')
  //
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [openCloneModal, setOpenCloneModal] = useState(false)
  const [deleteString, setDeleteString] = useState('')

  const route = useRoute('[section][type]')
  const section = route.query.section
  const routeType = route.query.type as string

  const client = useClient()

  const { data: schema, loading: loadingSchema } = useQuery('db:schema')

  const { data, loading } = useQuery('db', {
    $id: 'root',
    children: {
      $all: true,
      $list: {
        $find: {
          $filter: {
            $operator: '=',
            $value: routeType,
            $field: 'type',
          },
        },
      },
    },
  })

  console.log('DAS SCHEMA FIELDS', schema?.types[routeType]?.fields)

  useEffect(() => {
    if (schema) {
      let displayName = schema?.types[routeType]?.meta?.displayName

      setTypeName(openCloneModal ? routeType + '-copy' : routeType)
      setPluralName(openCloneModal ? displayName + '-copy' : displayName)
      setDescription(schema?.types[routeType]?.meta?.description)
    }
  }, [openEditModal, openCloneModal, routeType])

  return (
    <styled.div
      style={{
        display: 'flex',
        width: '100%',
        minHeight: '100%',
      }}
    >
      <SchemaSidebar />
      {routeType ? (
        <styled.div style={{ padding: '24px 48px', width: '100%' }}>
          <Row style={{ justifyContent: 'space-between', marginBottom: 36 }}>
            <Row>
              <Text size={24} weight="strong">
                {routeType as string}
              </Text>
              <Dropdown.Root>
                <Dropdown.Trigger>
                  <Button
                    icon={<IconMoreHorizontal />}
                    size="xsmall"
                    style={{ marginLeft: 8 }}
                  />
                </Dropdown.Trigger>
                <Dropdown.Items>
                  <Dropdown.Item
                    onClick={() => {
                      setOpenEditModal(true)
                    }}
                    icon={<IconEdit />}
                  >
                    Edit Type
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      setOpenCloneModal(true)
                    }}
                    icon={<IconCopy />}
                  >
                    Clone Type
                  </Dropdown.Item>
                  <Dropdown.Separator />
                  <Dropdown.Item
                    onClick={() => {
                      setOpenDeleteModal(true)
                    }}
                    icon={<IconDelete />}
                  >
                    Delete Type
                  </Dropdown.Item>
                </Dropdown.Items>
              </Dropdown.Root>
            </Row>
            {/* Add field button + options */}
            <AddField />
          </Row>
          <SchemaFields />
        </styled.div>
      ) : (
        <styled.div
          style={{
            padding: '24px 48px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <IconArrowLeft style={{ marginRight: 8 }} />
          <Text>Select a schema type to edit.</Text>
        </styled.div>
      )}

      {/* Edit  Modal */}
      <Modal.Root open={openEditModal} onOpenChange={setOpenEditModal}>
        <Modal.Content>
          <Modal.Title>Edit {routeType}</Modal.Title>
          <Modal.Body>
            <div style={{ display: 'grid', gap: 24 }}>
              <Input
                autoFocus
                disabled
                type="text"
                label="Type name"
                value={typeName}
                onChange={() => {}}
                style={{
                  pointerEvents: 'none',
                  '& :hover': {
                    cursor: 'not-allowed',
                  },
                }}
              />
              <Input
                label="Display name (plural)"
                type="text"
                value={pluralName}
                onChange={(v) => setPluralName(v)}
              />
              <Input
                label="Description"
                type="textarea"
                value={description}
                onChange={(v) => setDescription(v)}
              />
            </div>
          </Modal.Body>
          <Modal.Actions>
            <Button
              onClick={() => {
                setOpenEditModal(false)
              }}
              color="system"
              displayShortcut
              keyboardShortcut="Esc"
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                await client.call('db:set-schema', {
                  mutate: true,
                  schema: {
                    types: {
                      [routeType]: {
                        meta: {
                          displayName: pluralName,
                          description: description,
                        },
                      },
                    },
                  },
                })
                setOpenEditModal(false)
              }}
              color="primary"
              displayShortcut
              keyboardShortcut="Enter"
            >
              Save
            </Button>
          </Modal.Actions>
        </Modal.Content>
      </Modal.Root>
      {/* Clone  Modal */}
      <Modal.Root open={openCloneModal} onOpenChange={setOpenCloneModal}>
        <Modal.Content>
          <Modal.Title>Clone {routeType}</Modal.Title>
          <Modal.Body>
            <div style={{ display: 'grid', gap: 24 }}>
              <Input
                autoFocus
                type="text"
                label="New Type name"
                value={typeName}
                onChange={(v) => {
                  setTypeName(v)
                }}
              />
              <Input
                label="Display name (plural)"
                type="text"
                value={pluralName}
                onChange={(v) => setPluralName(v)}
              />
              <Input
                label="Description"
                type="textarea"
                value={description}
                onChange={(v) => setDescription(v)}
              />
            </div>
          </Modal.Body>
          <Modal.Actions>
            <Button
              onClick={() => {
                setOpenCloneModal(false)
              }}
              color="system"
              displayShortcut
              keyboardShortcut="Esc"
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                await client.call('db:set-schema', {
                  mutate: true,
                  schema: {
                    types: {
                      [typeName]: {
                        meta: {
                          displayName: pluralName,
                          description: description,
                        },
                        fields: schema.types[routeType].fields,
                      },
                    },
                  },
                })
                setOpenCloneModal(false)
              }}
              color="primary"
              displayShortcut
              keyboardShortcut="Enter"
            >
              Clone
            </Button>
          </Modal.Actions>
        </Modal.Content>
      </Modal.Root>
      {/* Delete modal */}
      <Modal.Root open={openDeleteModal} onOpenChange={setOpenDeleteModal}>
        <Modal.Content>
          <Modal.Title>Delete {routeType}</Modal.Title>
          <Modal.Description>
            You are about to delete {routeType} and all{' '}
            <b>{data?.children.length} </b>items.
          </Modal.Description>
          <Modal.Body>
            <div style={{ display: 'grid', gap: 24 }}>
              <Modal.Warning type="alert">
                Type <b>{routeType}</b> in the input to confirm
              </Modal.Warning>
              <Input
                autoFocus
                type="text"
                label="Type name"
                value={deleteString}
                onChange={(v) => {
                  setDeleteString(v)
                }}
              />
            </div>
          </Modal.Body>
          <Modal.Actions>
            <Button
              onClick={() => {
                setOpenDeleteModal(false)
              }}
              color="system"
              displayShortcut
              keyboardShortcut="Esc"
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                if (deleteString === routeType) {
                  await client.call('db:set-schema', {
                    mutate: true,
                    schema: {
                      types: {
                        [routeType]: {
                          $delete: true,
                        },
                      },
                    },
                  })
                }

                setDeleteString('')
                setOpenDeleteModal(false)
                //@ts-ignore
                route.setQuery({ section: section, type: null })
              }}
              color="alert"
              displayShortcut
              keyboardShortcut="Enter"
            >
              Delete
            </Button>
          </Modal.Actions>
        </Modal.Content>
      </Modal.Root>
    </styled.div>
  )
}
