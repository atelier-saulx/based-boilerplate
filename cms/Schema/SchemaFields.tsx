import React, { useEffect, useState } from 'react'
import { styled } from 'inlines'
import { useQuery, useClient } from '@based/react'
import { useRoute } from 'kabouter'
import { IconExtension, IconStar, Modal, Row, Confirmation } from '@based/ui'
import { CheckboxInput } from '@based/ui/dist/components/Input/CheckboxInput'
import { SCHEMA_FIELDS } from './AddField'
import { SpecificFieldModal } from './SpecificFieldModal'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { SchemaField } from './SchemaField'

const SYSTEM_FIELDS = [
  { label: 'type', icon: <IconExtension />, color: 'grey' },
  { label: 'id', icon: <IconStar />, color: 'grey' },
  { label: 'createdat' },
  { label: 'updatedat' },
  { label: 'parents' },
  { label: 'children' },
  { label: 'aliases' },
  { label: 'descendants' },
  { label: 'ancestors' },
]

const ALL_FIELDS = SYSTEM_FIELDS.concat(SCHEMA_FIELDS)

type SchemaItem = {
  name: string
  type: string
  description?: string
  meta: any
  id: string
  label: string
  order: number
}
type unorderedSchemaItem = Omit<SchemaItem, 'order'>

const parseSchema = (schema, routeType) => {
  if (!schema || !routeType) return
  const orderedArray = [] as SchemaItem[]
  const array = [] as unorderedSchemaItem[]
  const type = schema.types[routeType as string].fields
  for (const i in type) {
    if (type[i].meta?.order) {
      orderedArray.push({
        name: i,
        meta: type[i].meta,
        id: i,
        type: type[i].type,
        label: i,
        order: type[i].meta.order,
      })
    } else {
      array.push({
        name: i,
        meta: type[i].meta,
        id: i,
        type: type[i].type,
        label: i,
      })
    }
  }
  orderedArray.sort((a, b) => a?.order - b?.order)

  return [...orderedArray, ...array]
}

const parseItems = (items, schema, routeType) => {
  if (!items || !schema || !routeType) return
  const schemaType = schema.types[routeType as string].fields
  const object = {}
  for (const i in items) {
    const type = items[i]
    object[type.name] = {
      ...schemaType[type.name],
      meta: { ...type.meta, order: i },
    }
  }
  return object
}

export const SchemaFields = () => {
  const route = useRoute('[section][type]')
  const routeType = route.query.type

  const client = useClient()

  const [showSystemFields, setShowSystemFields] = useState(false)
  const [openEditModal, setOpenEditModal] = useState(false)
  const [itemToEdit, setItemToEdit] = useState('')
  const [rearrange, setRearrange] = useState(false)

  const { data: schema, loading: loadingSchema } = useQuery('db:schema')

  // console.log('Schema?? 🐸', schema)

  const SYSTEM_FIELDS_LABELS = SYSTEM_FIELDS.map((item) => item.label)
  // console.log(schema?.types[routeType as string].fields)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )
  const [array, setArray] = useState<
    SchemaItem[] | unorderedSchemaItem[] | any
  >(parseSchema(schema, routeType))

  useEffect(() => {
    setArray(parseSchema(schema, routeType))
    setRearrange(false)
  }, [schema, routeType])

  return (
    <div style={{}}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <CheckboxInput
          title="Show system fields"
          value={showSystemFields}
          onChange={(v) => setShowSystemFields(v)}
          style={{ marginBottom: 32, width: 'fit-content' }}
        />
        <SortableContext
          items={array?.length > 0 ? array : [0, 1]}
          strategy={verticalListSortingStrategy}
        >
          {schema &&
            array
              ?.filter((item) =>
                !showSystemFields
                  ? !SYSTEM_FIELDS_LABELS.includes(item.name.toLowerCase())
                  : item
              )
              .map((item, i) => {
                let index = ALL_FIELDS.findIndex(
                  (x) => x.label?.toLowerCase() === item.type.toLowerCase()
                )
                return (
                  <SchemaField
                    id={item.id}
                    ALL_FIELDS={ALL_FIELDS}
                    SYSTEM_FIELDS_LABELS={SYSTEM_FIELDS_LABELS}
                    index={index}
                    item={item}
                    setItemToEdit={setItemToEdit}
                    setOpenEditModal={setOpenEditModal}
                    key={item.id}
                    onClick={async () => {
                      const fields = schema?.types[routeType as string].fields

                      // delete fields[item.name]

                      // console.log('fields now --.', fields)

                      // const path = field.split('.')
                      // const currentFields =
                      //   schema.types[routeType as string].fields
                      // const fields = {}
                      // let from = currentFields
                      // let dest = fields
                      // let i = 0
                      // const l = path.length

                      // while (i < l) {
                      //   const key = path[i++]
                      //   dest[key] = { ...from[key] }
                      //   dest = dest[key]
                      //   // @ts-ignore
                      //   from = from[key]
                      // }

                      // // @ts-ignore
                      // dest.$delete = true

                      await client.call('db:set-schema', {
                        mutate: true,
                        schema: {
                          types: {
                            // @ts-ignore
                            [routeType]: {
                              fields,
                            },
                          },
                        },
                      })
                    }}
                  />
                )
              })}
        </SortableContext>
        {/* Edit  Modal */}
        <Modal.Root open={openEditModal} onOpenChange={setOpenEditModal}>
          <Modal.Content>
            <Modal.Title>
              <Row>
                {/* <Thumbnail
                size="small"
                icon={item.icon}
                light
                color={selectedItem.color}
                style={{ marginRight: 12 }}
              /> */}
                {/* Edit {item.name} */}
              </Row>
            </Modal.Title>
            <SpecificFieldModal
              field={itemToEdit}
              setOpenSpecificFieldModal={setOpenEditModal}
            />
          </Modal.Content>
        </Modal.Root>
      </DndContext>
      <div style={{ height: 20 }} />
      {rearrange && (
        <Confirmation
          // style={{ marginTop: '40px', marginBottom: 0 }}
          onCancel={() => {
            setRearrange(false)
            setArray(parseSchema(schema, routeType))
          }}
          label="Confirm"
          onConfirm={async () => {
            await client.call('db:set-schema', {
              mutate: true,
              schema: {
                types: {
                  [routeType as string]: {
                    fields: parseItems(array, schema, routeType),
                  },
                },
              },
            })
          }}
        />
      )}
    </div>
  )
  function handleDragEnd(event) {
    const { active, over } = event

    if (active.id !== over.id) {
      setRearrange(true)
      setArray((items) => {
        const oldIndex = items?.findIndex(
          (item) => item.id === active.id
        ) as number
        const newIndex = items?.findIndex(
          (item) => item.id === over.id
        ) as number
        return arrayMove(items as any, oldIndex, newIndex)
      })
    }
  }
}
