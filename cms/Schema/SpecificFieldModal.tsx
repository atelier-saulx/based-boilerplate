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

            console.log('ORB', fieldType.toLowerCase())

            if (meta.displayName) {
              const newMeta = Object.fromEntries(
                Object.entries(meta).filter(([_, v]) => v != false)
              )

              // NESTED OBJECT USE nestedFields
              let nestedFields = {}
              if (nestedObjectPath) {
                let newArr: string[] = []

                nestedObjectPath.map((item) => {
                  newArr.push(item)
                  newArr.push('properties')
                })
                // build object path

                newArr.reduce(function (o, s, idx) {
                  console.log('IDX?', idx)
                  if (idx === newArr.length - 1) {
                    // add the fields to the last one
                    return (o[s] = {
                      [meta.name || meta.displayName?.toLowerCase()]: {
                        type: fieldType.toLowerCase(),
                        // label: meta.name || meta.displayName.toLowerCase(),
                        // id: meta.name || meta.displayName.toLowerCase(),
                        properties:
                          fieldType.toLowerCase() === 'object' ? {} : null,
                        values:
                          fieldType.toLowerCase() === 'record' ? [] : null,
                        //  index: +thisSpecificField?.index || +newIndex,
                        meta: {
                          ...newMeta,
                          name: meta.name || meta.displayName.toLowerCase(),
                        },
                      },
                    })
                  } else if (newArr[idx] !== 'properties') {
                    return (o[s] = {
                      type: 'object',
                    })
                  } else {
                    return (o[s] = {
                      // meta: { name: s },
                      // type: fieldType.toLowerCase(),
                    })
                  }
                }, nestedFields)

                console.log(nestedFields, '🚁')
              }

              // ELSE USE NORMAL FIELDS IN SCHEMA
              let fields = {
                // [nestedObjectPath[0]]: {
                //    properties : {
                //
                //  }
                // }
                [meta.name || meta.displayName.toLowerCase()]: {
                  type: fieldType.toLowerCase(),
                  // label: meta.name || meta.displayName.toLowerCase(),
                  // id: meta.name || meta.displayName.toLowerCase(),
                  properties: fieldType.toLowerCase() === 'object' ? {} : null,
                  values: fieldType.toLowerCase() === 'record' ? [] : null,
                  index: +thisSpecificField?.index || +newIndex,
                  meta: {
                    ...newMeta,
                    name: meta.name || meta.displayName.toLowerCase(),
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
                            index: +thisSpecificField?.index || +newIndex,
                            meta: {
                              ...newMeta,
                              linkedField: `${
                                meta.field || meta.displayName.toLowerCase()
                              }HTML`,
                              format: 'rich-text',
                            },
                          },
                          [`${
                            meta.field || meta.displayName.toLowerCase()
                          }HTML`]: {
                            type: 'string',
                            meta: { isLinkedField: true },
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
