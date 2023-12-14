import React, { useEffect, useState } from 'react'
import { styled } from 'inlines'
import { useQuery, useClient } from '@based/react'
import { useRoute } from 'kabouter'
import {
  IconExtension,
  IconStar,
  Modal,
  Row,
  Confirmation,
  Text,
  Button,
  IconDelete,
} from '@based/ui'
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
  index?: number
  properties: {}
}
type unindexedSchemaItem = Omit<SchemaItem, 'index'>

const parseSchema = (schema, routeType) => {
  if (!schema || !routeType) return
  const indexedArray = [] as SchemaItem[]
  const array = [] as unindexedSchemaItem[]
  const type = schema.types[routeType as string]?.fields

  // console.log('indexed array ---->', indexedArray)
  // console.log('unindex', array)

  for (const i in type) {
    // console.log('🔫 meta', type[i]?.meta, 'index', type[i]?.index, type[i])
    if (type[i].hasOwnProperty('meta')) {
      // console.log('REACh 🔥')
      indexedArray.push({
        name: i,
        meta: type[i].meta,
        id: i,
        type: type[i].type,
        label: i,
        index: type[i]?.meta.index || +i,
        // index: type[i].meta.index,
        properties: type[i].properties,
      })
    } else if (!type[i].index) {
      console.log('REACh 🐧')
      array.push({
        name: i,
        meta: type[i].meta,
        id: i,
        type: type[i].type,
        label: i,
        //  index: i,
        properties: type[i].properties,
      })
    }
    // else {
    //   console.log('REACH THIS>>> 🫔')
    //   array.push({ ...type })
    // }
  }

  indexedArray.sort((a, b) => a.meta.index - b.meta.index)

  // console.log('indexed array ---->', indexedArray)
  // console.log('unindex', array)

  return [...indexedArray, ...array]
}

const parseItems = (items, schema, routeType) => {
  if (!items || !schema || !routeType) return
  const schemaType = schema.types[routeType as string].fields
  const object = {}
  for (const i in items) {
    const type = items[i]
    object[type.name] = {
      ...schemaType[type.name],
      index: +i, // TODO yves: if index works on all fields turn on
      meta: { ...type.meta, index: +i },
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
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [itemToEdit, setItemToEdit] = useState('')

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
    SchemaItem[] | unindexedSchemaItem[] | any
  >(parseSchema(schema, routeType))

  useEffect(() => {
    setArray(parseSchema(schema, routeType))
  }, [schema, routeType])

  return (
    <div style={{ maxWidth: 676, margin: '34px auto' }}>
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
                  ? !SYSTEM_FIELDS_LABELS.includes(item?.name?.toLowerCase())
                  : item
              )
              ?.map((item, i) => {
                let index = ALL_FIELDS?.findIndex(
                  (x) => x?.label?.toLowerCase() === item?.type?.toLowerCase()
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
                    setOpenDeleteModal={setOpenDeleteModal}
                    key={item.id}
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
              editField
            />
          </Modal.Content>
        </Modal.Root>
        {/* Delete modal */}
        <Modal.Root open={openDeleteModal} onOpenChange={setOpenDeleteModal}>
          <Modal.Content>
            {({ close }) => (
              <>
                <Modal.Title>Delete field</Modal.Title>
                <Modal.Body>
                  <Text>
                    Are you sure you want to delete the field{' '}
                    <b>{itemToEdit}</b>
                  </Text>
                  <Modal.Warning type="alert">
                    You are about to delete the field <b>{itemToEdit}</b> for
                    all users.
                  </Modal.Warning>
                </Modal.Body>
                <Modal.Actions>
                  <Button onClick={close} color="system">
                    Cancel
                  </Button>
                  <Button
                    onClick={async () => {
                      await client.call('db:set-schema', {
                        mutate: true,
                        schema: {
                          types: {
                            [routeType as string]: {
                              fields: {
                                [itemToEdit]: { $delete: true },
                              },
                            },
                          },
                        },
                      })
                      close()
                    }}
                    color="alert"
                    icon={<IconDelete />}
                    displayShortcut
                    keyboardShortcut="Enter"
                  >
                    Delete
                  </Button>
                </Modal.Actions>
              </>
            )}
          </Modal.Content>
        </Modal.Root>
      </DndContext>
      <div style={{ height: 20 }} />
    </div>
  )

  async function handleDragEnd(event) {
    const { active, over } = event
    const thingy = async () => {
      await client.call('db:set-schema', {
        mutate: true,
        schema: {
          types: {
            [routeType as string]: {
              fields: parseItems(tempArr, schema, routeType),
            },
          },
        },
      })
    }
    let tempArr = []
    if (active.id !== over.id) {
      setArray((items) => {
        const oldIndex = items?.findIndex(
          (item) => item.id === active.id
        ) as number
        console.log('olds index', oldIndex)
        const newIndex = items?.findIndex(
          (item) => item.id === over.id
        ) as number
        tempArr = arrayMove(items as any, oldIndex, newIndex)
        thingy()
        return arrayMove(items as any, oldIndex, newIndex)
      })
    }
  }
}
