import React, { useReducer, useState, useEffect } from 'react'
import { styled } from 'inlines'
import { useRoute } from 'kabouter'
import { Modal, Button, Input, Tab, Tabs, getPluralName } from '@based/ui'
import { useClient, useQuery } from '@based/react'
import { SpecificFieldSettings } from './SpecificFieldSettings'

type SpecificFieldModalProps = {
  field: string
  setOpenSpecificFieldModal: (v: boolean) => void
  editField?: boolean
  nestedObjectPath?: string[]
}

function setDeep(obj, path, value, setrecursively = false) {
  path.reduce((a, b, level) => {
    if (
      setrecursively &&
      typeof a[b] === 'undefined' &&
      level !== path.length
    ) {
      a[b] = {}
      return a[b]
    }

    if (level === path.length - 1) {
      a[b] = value
      return value
    }
    return a[b]
  }, obj)
}

const metaReducer = (state, action) => {
  if (action.type === 'prune') {
    const newMeta = Object.fromEntries(
      Object.entries(state).filter(([_, v]) => v != false)
    )
    return newMeta
  } else {
    return {
      ...state,
      [action.field]: action.value,
    }
  }
}

export const SpecificFieldModal = ({
  field,
  setOpenSpecificFieldModal,
  editField,
  nestedObjectPath,
}: SpecificFieldModalProps) => {
  const [meta, setMeta] = useReducer(metaReducer, {})
  const [fieldType, setFieldType] = useState(field)

  const route = useRoute('[section][type]')
  const routeType = route.query.type as string

  const client = useClient()

  const { data: schema, loading: loadingSchema } = useQuery('db:schema')

  let thisSpecificField = schema.types[routeType].fields[field]

  let newIndex = Object.keys(schema.types[routeType].fields).length + 1
  // console.log(
  //   Object.keys(schema.types[routeType].fields).length,
  //   'current length'
  // )

  console.log('FIELD??', schema?.types[routeType]?.fields[field])
  // console.log(meta, 'meta')

  useEffect(() => {
    if (thisSpecificField?.meta) {
      for (const [key, value] of Object.entries(thisSpecificField?.meta)) {
        setMeta({ field: key, value: value })
      }
    }
    if (thisSpecificField?.type) {
      setFieldType(thisSpecificField.type)
      console.log('🐧', field)
    }
  }, [])

  return (
    <>
      <Modal.Body>
        <Tabs>
          <Tab label="General">
            <div style={{ display: 'grid', gap: 12 }}>
              <Input
                autoFocus
                type="text"
                label="Display name"
                description="Name that will be displayed in the interface"
                value={meta?.displayName}
                onChange={(v) => {
                  // setDisplayName(v)
                  setMeta({ field: 'displayName', value: v })
                }}
              />
              <Input
                label="Field name"
                description="API field-name used in the sdk and clients"
                type="text"
                disabled={editField}
                style={{ pointerEvents: editField ? 'none' : 'auto' }}
                value={meta?.name || meta?.displayName?.toLowerCase() || ''}
                onChange={(v) => setMeta({ field: 'name', value: v })}
              />
              <Input
                label="Description (Optional)"
                description="Displays a hint for content editors"
                type="textarea"
                value={meta?.description}
                onChange={(v) => setMeta({ field: 'description', value: v })}
              />
              <styled.div style={{ display: 'flex', marginTop: 16 }}>
                <Input
                  type="checkbox"
                  title="Is required"
                  value={meta?.isRequired}
                  onChange={(v) => setMeta({ field: 'isRequired', value: v })}
                />
                <Input
                  type="checkbox"
                  title="Read only"
                  value={meta?.readOnly}
                  onChange={(v) => {
                    if (v) {
                      setMeta({ field: 'readOnly', value: v })
                      if (meta?.writeOnly) {
                        setMeta({ field: 'writeOnly', value: !v })
                      }
                    } else {
                      setMeta({ field: 'readOnly', value: v })
                    }
                  }}
                />
                <Input
                  type="checkbox"
                  title="Write only"
                  value={meta?.writeOnly}
                  onChange={(v) => {
                    if (v) {
                      setMeta({ field: 'writeOnly', value: v })
                      if (meta?.readOnly) {
                        setMeta({ field: 'readOnly', value: !v })
                      }
                    } else {
                      setMeta({ field: 'writeOnly', value: v })
                    }
                  }}
                />
              </styled.div>
            </div>
          </Tab>
          {fieldType.toLowerCase() !== 'boolean' &&
          fieldType.toLowerCase() !== 'cardinality' &&
          fieldType.toLowerCase() !== 'json' ? (
            <Tab label="Settings">
              <SpecificFieldSettings
                fieldType={fieldType.toLowerCase()}
                setMeta={setMeta}
                meta={meta}
              />
            </Tab>
          ) : (
            <></>
          )}
        </Tabs>
      </Modal.Body>
      <Modal.Actions>
        <Button
          onClick={() => {
            setOpenSpecificFieldModal(false)
          }}
          color="system"
          displayShortcut
          keyboardShortcut="Esc"
        >
          Cancel
        </Button>
        <Button
          onClick={async () => {
            // TODO set meta fields if there are also description
            // let metaFields

            // console.log('ORB', fieldType.toLowerCase())
            // console.log(nestedObjectPath, 'NESTED 🦜')

            if (meta.displayName) {
              const newMeta = Object.fromEntries(
                Object.entries(meta).filter(([_, v]) => v != false)
              )

              console.log(newMeta, 'NEW')

              // NESTED OBJ LOGIC
              let nestedFields = {}

              //NestedObjectPath length is de diepte waar het gezet moet worden
              if (nestedObjectPath) {
                nestedFields = {
                  [nestedObjectPath[0]]: {
                    ...schema?.types[routeType]?.fields[nestedObjectPath[0]],
                  },
                }

                let newArr: string[] = []
                nestedObjectPath.map((item) => {
                  newArr.push(item)
                  newArr.push('properties')
                })
                console.log('NEW ARR', newArr)

                console.log('TEST --> ', nestedFields)

                setDeep(
                  nestedFields,
                  newArr,
                  {
                    [meta.name || meta.displayName.toLowerCase()]: {
                      type: fieldType.toLowerCase(),
                      meta: {
                        ...newMeta,
                        name: meta.name || meta.displayName.toLowerCase(),
                        index: thisSpecificField?.meta.index || newIndex,
                      },
                      properties:
                        fieldType.toLowerCase() === 'object' ? {} : null,
                    },
                  },
                  true
                )
              }

              // ELSE USE NORMAL FIELDS LOGIC IN SCHEMA
              let fields = {
                [meta.name || meta.displayName.toLowerCase()]: {
                  type: fieldType.toLowerCase(),
                  label: meta.name || meta.displayName.toLowerCase(),
                  id: meta.name || meta.displayName.toLowerCase(),
                  properties: fieldType.toLowerCase() === 'object' ? {} : null,
                  values: fieldType.toLowerCase() === 'record' ? [] : null,
                  index: thisSpecificField?.index || newIndex,
                  meta: {
                    ...newMeta,
                    name: meta.name || meta.displayName.toLowerCase(),
                    index: thisSpecificField?.meta.index || newIndex,
                  },
                },
              }

              if (fieldType === 'Rich Text') {
                await client.call('db:set-schema', {
                  mutate: true,
                  schema: {
                    types: {
                      [routeType]: {
                        fields: {
                          [meta.name || meta.displayName.toLowerCase()]: {
                            type: 'json',
                            // TODO
                            index: +thisSpecificField?.index || +newIndex,
                            meta: {
                              ...newMeta,
                              linkedField: `${
                                meta.field || meta.displayName.toLowerCase()
                              }HTML`,
                              format: 'rich-text',
                              index:
                                +thisSpecificField?.meta.index || +newIndex,
                            },
                          },
                          [`${
                            meta.field || meta.displayName.toLowerCase()
                          }HTML`]: {
                            type: 'string',
                            meta: {
                              isLinkedField: true,
                              index:
                                +thisSpecificField?.meta.index || +newIndex,
                            },
                          },
                        },
                      },
                    },
                  },
                })
              } else {
                await client.call('db:set-schema', {
                  mutate: true,
                  schema: {
                    types: {
                      [routeType]: {
                        fields: nestedObjectPath ? nestedFields : fields,
                      },
                    },
                  },
                })
              }

              setOpenSpecificFieldModal(false)
            }
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
}
