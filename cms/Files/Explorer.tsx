import React, { useEffect, useState } from 'react'
import { styled } from 'inlines'
import { Tile } from './Tile'
import {
  Button,
  FormGroup,
  SidePanel,
  scrollAreaStyle,
  useInfiniteQuery,
} from '@based/ui'
import { useClient, useQuery } from '@based/react'
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  rectSwappingStrategy,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'

const FILTER_FIELDS = ['type', 'ancestors', 'descendants', 'aliases']

export const Explorer = ({}) => {
  const [openSidebar, setOpenSidebar] = useState(false)
  const [selected, setSelected] = useState('')
  const [formFieldChanges, setFormFieldChanges] = useState<any>({})

  const { data, fetchMore, setVisibleElements, filterChange } =
    useInfiniteQuery(
      {
        accessFn: (data) => data.files,
        queryFn: (offset) => ({
          $id: 'root',
          files: {
            $all: true,
            $list: {
              $sort: { $field: 'updatedAt', $order: 'desc' },
              $offset: offset,
              //   $limit: 25,
              $find: {
                $traverse: 'children',
                $filter: {
                  $operator: '=',
                  $field: 'type',
                  $value: 'file',
                },
              },
            },
          },
          folder: {
            $all: true,
            $list: {
              $sort: { $field: 'updatedAt', $order: 'desc' },
              $offset: offset,
              //   $limit: 25,
              $find: {
                $traverse: 'children',
                $filter: {
                  $operator: '=',
                  $field: 'type',
                  $value: 'folder',
                },
              },
            },
          },
        }),
      }

      // , [filter]
    )
  const client = useClient()
  const { data: schema, loading } = useQuery('db:schema')
  const { data: fileData, loading: loadingFile } = useQuery('db', {
    $id: selected,
    $all: true,
  })

  const [array, setArray] = useState<any>(data)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  let schemaFields = schema?.types.file.fields
  let filteredSchemaFields = {}
  if (schema) {
    for (const [key, value] of Object.entries(schemaFields)) {
      if (!FILTER_FIELDS.includes(key)) {
        filteredSchemaFields[key] = value
      }
    }
  }

  useEffect(() => {
    setArray(data)
  }, [data])

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <styled.div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
          height: '100%',
          gap: 15,
        }}
      >
        <SortableContext
          items={array?.length > 0 ? array : [0]}
          strategy={rectSwappingStrategy}
        >
          {array?.length > 0 &&
            array.map((value, i) => (
              <Tile
                id={value.id}
                name={value.name}
                key={i}
                setSelected={setSelected}
                folder={false}
                setOpenSidebar={setOpenSidebar}
              />
            ))}
        </SortableContext>
        <DragOverlay>
          <Tile
            name={'blabla'}
            id={selected}
            setSelected={setSelected}
            folder={false}
            setOpenSidebar={setOpenSidebar}
          />
        </DragOverlay>
        <SidePanel.Root open={openSidebar}>
          <SidePanel.Content>
            <SidePanel.Title closeFunc={() => setOpenSidebar(false)}>
              Name
            </SidePanel.Title>
            <SidePanel.Body>
              <FormGroup
                onChange={(v) => {
                  // setSomeThingChanged(true)
                  setFormFieldChanges({ ...formFieldChanges, ...v })
                }}
                values={{ ...fileData, ...formFieldChanges }}
                alwaysAccept
                config={filteredSchemaFields}
              />
            </SidePanel.Body>
            <SidePanel.Actions>
              <Button
                keyboardShortcut="Esc"
                displayShortcut
                color="system"
                onClick={() => {
                  setFormFieldChanges({})
                  setOpenSidebar(false)
                }}
              >
                Cancel
              </Button>
              <Button
                keyboardShortcut="Enter"
                displayShortcut
                onClick={async () => {
                  await client
                    .call('db:set', {
                      $id: selected,
                      ...fileData,
                      ...formFieldChanges,
                    })
                    .catch((err) => console.log(err))
                  setFormFieldChanges({})
                }}
              >
                Save
              </Button>
            </SidePanel.Actions>
          </SidePanel.Content>
        </SidePanel.Root>
      </styled.div>
    </DndContext>
  )

  async function handleDragEnd(event) {
    const { active, over } = event
    // const thingy = async () => {
    //   await client.call('db:set-schema', {
    //     mutate: true,
    //     schema: {
    //       types: {
    //         [routeType as string]: {
    //           fields: parseItems(tempArr, schema, routeType),
    //         },
    //       },
    //     },
    //   })
    // }
    // let tempArr = []
    if (active.id !== over.id) {
      console.log('asdadasdasd')
      setArray((items) => {
        const oldIndex = items?.findIndex(
          (item) => item.id === active.id
        ) as number
        const newIndex = items?.findIndex(
          (item) => item.id === over.id
        ) as number

        // tempArr = arrayMove(items as any, oldIndex, newIndex)
        // thingy()
        return arrayMove(items as any, oldIndex, newIndex)
      })
    }
  }
}
