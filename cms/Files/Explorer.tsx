import React, { useEffect, useRef, useState } from 'react'
import { styled } from 'inlines'
import { Tile } from './Tile'
import {
  Button,
  FormGroup,
  IconArrowLeft,
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
  rectIntersection,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  rectSortingStrategy,
  rectSwappingStrategy,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'

const FILTER_FIELDS = ['type', 'ancestors', 'descendants', 'aliases']
const filterFolder = () => {}

export const Explorer = ({}) => {
  const [openSidebar, setOpenSidebar] = useState(false)
  const [selected, setSelected] = useState('')
  const [rootId, setRootId] = useState(['root'])
  const [path, setPath] = useState([rootId])
  const [formFieldChanges, setFormFieldChanges] = useState<any>({})
  console.log(rootId[rootId.length - 1])
  const { data, fetchMore, setVisibleElements, filterChange } =
    useInfiniteQuery(
      {
        accessFn: (data) => data.files,
        queryFn: (offset) => ({
          $id: rootId[rootId.length - 1],
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
                  $value: ['folder', 'file'],
                },
              },
            },
          },
        }),
      }

      //   [rootId]
    )

  //   const { data, loading: asdf } = useQuery('db', {
  //     $id: rootId[rootId.length - 1],
  //     file: {
  //       $all: true,
  //       $list: {
  //         $find: {
  //           $traverse: 'children',
  //           $filter: {
  //             $field: 'type',
  //             $operator: '=',
  //             $value: ['folder', 'file'],
  //           },
  //         },
  //       },
  //     },
  //   })

  const client = useClient()
  const { data: schema, loading } = useQuery('db:schema')
  const { data: fileData, loading: loadingFile } = useQuery('db', {
    $id: selected,
    $all: true,
  })
  const [array, setArray] = useState<any>(data)

  const dragItem = useRef()
  const dragOverItem = useRef()

  const dragStart = (e) => {
    dragItem.current = e.target.id
  }
  const dragEnter = (e) => {
    dragOverItem.current = e.currentTarget.id
  }
  const drop = (e) => {
    console.log(dragItem, dragOverItem)
    if (true) {
      setArray((items) => {
        const activeIndex = items?.findIndex(
          (item) => item.id === dragItem.current
        ) as number
        const overIndex = items?.findIndex(
          (item) => item.id === dragOverItem.current
        ) as number

        // for (const i in array) {
        //   if (parseInt(i) === overIndex) {
        //     newArr.push(array[activeIndex])
        //   } else if (parseInt(i) === activeIndex) {
        //     newArr.push(array[overIndex])
        //   } else {
        //     newArr.push(array[parseInt(i)])
        //   }
        // }
        // return newArr
        return arrayMove(items, activeIndex, overIndex)
      })
    }
  }

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
  }, [data, rootId])

  console.log(data)

  useEffect(() => {
    // console.log('asdasd')
    filterChange()
    fetchMore()
    // setVisibleElements(25)
  }, [rootId])

  return (
    <styled.div>
      {rootId.length > 1 && (
        <Button
          onClick={() =>
            setRootId(rootId.filter((_, i) => i !== rootId.length - 1))
          }
          size="xsmall"
          color="system"
          icon={<IconArrowLeft />}
        >
          Back
        </Button>
      )}
      <styled.div
        id={rootId}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
          height: '100%',
          gap: 15,
        }}
      >
        {array?.length > 0 &&
          array.map((value, i) => {
            return (
              <Tile
                dragEnter={dragEnter}
                dragStart={dragStart}
                onDragEnd={drop}
                src={value?.src}
                rootId={rootId}
                setRootId={setRootId}
                folder={value.type === 'folder'}
                id={value.id}
                name={value.name}
                key={i}
                setSelected={setSelected}
                setOpenSidebar={setOpenSidebar}
              />
            )
          })}
      </styled.div>
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
    // "fi24f874df"
    // 'fiEEXJisx0'
    // let tempArr = []

    if (active.id !== over.id) {
      //   setItems((items) => {
      //     const oldIndex = items.indexOf(active.id);
      //     const newIndex = items.indexOf(over.id);
      //     return arrayMove(items, oldIndex, newIndex);
      //   });
      setArray((items) => {
        const newArr = [] as any

        const activeIndex = items?.findIndex(
          (item) => item.id === active.id
        ) as number
        const overIndex = items?.findIndex(
          (item) => item.id === over.id
        ) as number

        // for (const i in array) {
        //   if (parseInt(i) === overIndex) {
        //     newArr.push(array[activeIndex])
        //   } else if (parseInt(i) === activeIndex) {
        //     newArr.push(array[overIndex])
        //   } else {
        //     newArr.push(array[parseInt(i)])
        //   }
        // }
        return arrayMove(items, activeIndex, overIndex)

        return newArr
      })
    }
  }
}
