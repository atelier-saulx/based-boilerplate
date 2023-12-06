import React, { useState } from 'react'
import { useRoute } from 'kabouter'
import { useQuery, useClient } from '@based/react'
import { styled } from '@based/ui'
import { Menu, Modal, Button, IconPlus, Input, getPluralName } from '@based/ui'

export const SchemaSidebar = () => {
  const route = useRoute('[section][type]')

  const section = route.query.section
  const routeType = route.query.type

  const [typeName, setTypeName] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [description, setDescription] = useState('')

  const { data: schema, loading: loadingSchema } = useQuery('db:schema')
  const client = useClient()

  let menuItems = {}

  if (schema) {
    let schemaTypes = schema?.types
    let schemaTypeKeys = Object.keys(schemaTypes).sort((a, b) =>
      a.localeCompare(b)
    )

    schemaTypeKeys
      .filter((key) => key !== 'user')
      .filter((key) => key !== 'file')
      .map((key) => {
        menuItems[key] = {
          value: key,
          label: schemaTypes[key]?.meta?.displayName || key,
        }
      })
  }

  return (
    <Menu
      header={
        <styled.div
          style={{ position: 'relative', width: '100%', minHeight: '100%' }}
        >
          <Modal.Root>
            <Modal.Trigger>
              <Button icon={<IconPlus />} light size="small">
                Add Type
              </Button>
            </Modal.Trigger>
            <Modal.Content>
              {({ close }) => {
                return (
                  <>
                    <Modal.Title>Create a new type</Modal.Title>
                    <Modal.Description>
                      Add your own custom type.
                    </Modal.Description>
                    <Modal.Body>
                      <div style={{ display: 'grid', gap: 24 }}>
                        <Input
                          autoFocus
                          type="text"
                          label="Type name"
                          value={typeName}
                          onChange={(v) => {
                            setTypeName(v)
                          }}
                        />
                        {displayName}
                        <Input
                          label="Display name (plural)"
                          type="text"
                          value={
                            displayName ||
                            (typeName && getPluralName(schema, typeName))
                            // TODO: get this generatePlural from UI lib
                            // ? generatePlural(typeName) : undefined
                          }
                          onChange={(v) => setDisplayName(v)}
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
                        onClick={close}
                        color="system"
                        displayShortcut
                        keyboardShortcut="Esc"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={async () => {
                          const type = typeName
                          const typeSchema = {
                            fields: {},
                            meta: {
                              name: typeName,
                              displayName:
                                displayName ||
                                (typeName && getPluralName(schema, typeName)),
                              description: description,
                            },
                          }
                          if (schema) {
                            schema.types[type] = typeSchema
                          }

                          await client.call('db:set-schema', {
                            mutate: true,
                            // db,
                            schema: {
                              types: {
                                [type]: typeSchema,
                              },
                            },
                          })

                          close()
                        }}
                        color="primary"
                        displayShortcut
                        keyboardShortcut="Enter"
                      >
                        Save
                      </Button>
                    </Modal.Actions>
                  </>
                )
              }}
            </Modal.Content>
          </Modal.Root>
        </styled.div>
      }
      config={{
        ['schema types']: menuItems,
      }}
      onChange={(v) => {
        route.setQuery({ type: v })
      }}
      active={routeType}
    />
  )
}
