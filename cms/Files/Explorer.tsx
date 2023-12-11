import React, { useEffect, useReducer, useRef, useState } from 'react'
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
import { arrayMove } from '@dnd-kit/sortable'
import { useRoute } from 'kabouter'

const FILTER_FIELDS = ['type', 'ancestors', 'descendants', 'aliases']

const filterFolder = (data, rootId) => {
  if (data?.length < 1) return
  const newArr = [] as any
  for (const i in data) {
    if (
      data[i].parents?.filter((j) => j[0] + j[1] === 'di').length === 1 &&
      !data[i].parents
        .filter((i) => i !== 'root')
        .includes(rootId[rootId.length - 1])
    ) {
    } else {
      newArr.push(data[i])
    }
  }
  return newArr
}

export const Explorer = ({}) => {
  const dragItem = useRef()
  const dragOverItem = useRef()
  // const [dragOverItem, setDragOverItem] = useState()
  // const [dragItem, setDragItem] = useState()

  const dragStart = (e) => {
    // e.preventDefault()
    dragItem.current = e.target.id
    // setDragItem(e.target.id)
  }
  const dragEnter = (e) => {
    // e.preventDefault()
    dragOverItem.current = e.currentTarget.id
    // setDragOverItem(e.target.id)
  }
  const drop = (e) => {
    if (true) {
      setArray((items) => {
        const activeIndex = items?.findIndex(
          (item) => item.id === dragItem.current
        ) as number
        const overIndex = items?.findIndex(
          (item) => item.id === dragOverItem.current
        ) as number

        return arrayMove(items, activeIndex, overIndex)
      })
    }
  }

  const [openSidebar, setOpenSidebar] = useState(false)
  const [selected, setSelected] = useState('')
  const [rootId, setRootId] = useState(['root'])
  const [formFieldChanges, setFormFieldChanges] = useState<any>({})
  const client = useClient()

  const route = useRoute('[folder]')
  const section = route.query.folder

  // const { data, fetchMore, setVisibleElements, filterChange } =
  //   useInfiniteQuery({
  //     accessFn: (data) => data.files,
  //     queryFn: (offset) => ({
  //       //@ts-ignore
  //       $id: section.length > 0 ? section : 'root',
  //       files: {
  //         $all: true,
  //         parents: true,
  //         $list: {
  //           $sort: { $field: 'updatedAt', $order: 'desc' },
  //           $offset: offset,
  //           //   $limit: 25,
  //           $find: {
  //             $traverse: 'children',
  //             $filter: {
  //               $operator: '=',
  //               $field: 'type',
  //               $value: ['folder', 'file'],
  //             },
  //           },
  //         },
  //       },
  //     }),
  //   })

  const { data, loading: dataLoading } = useQuery('db', {
    //@ts-ignore
    $id: section.length > 0 ? section : 'root',
    files: {
      $all: true,
      parents: true,
      $list: {
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
  })
  // console.log(section)

  console.log(data)
  useEffect(() => {
    setArray(data?.files)
  }, [data])

  const [, forceUpdate] = useReducer((x) => x + 1, 0)

  // console.log('DATA', data)
  // useEffect(() => {
  //   console.log('change')
  //   filterChange()
  //   // fetchMore()
  //   forceUpdate()
  // }, [section])

  const { data: schema, loading } = useQuery('db:schema')
  const { data: fileData, loading: loadingFile } = useQuery('db', {
    $id: selected,
    $all: true,
  })
  const [array, setArray] = useState<any>(filterFolder(data, rootId))

  let schemaFields = schema?.types.file.fields
  let filteredSchemaFields = {}
  if (schema) {
    for (const [key, value] of Object.entries(schemaFields)) {
      if (!FILTER_FIELDS.includes(key)) {
        filteredSchemaFields[key] = value
      }
    }
  }

  return (
    <styled.div>
      <Button
        onClick={() => route.setQuery({ folder: 'root' })}
        size="xsmall"
        color="system"
        icon={<IconArrowLeft />}
      >
        Back
      </Button>

      <Button
        onClick={async () => {
          // fetchMore()
        }}
      >
        RERENDER
      </Button>
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
              <div style={{}}>
                {/* @ts-ignore */}
                <Tile
                  dragOverItem={dragOverItem}
                  dragEnter={dragEnter}
                  dragStart={dragStart}
                  onDragEnd={drop}
                  src={value?.src}
                  rootId={rootId}
                  setRootId={setRootId}
                  folder={value.type === 'folder'}
                  id={value.id}
                  name={value.name}
                  key={value.id}
                  setSelected={setSelected}
                  setOpenSidebar={setOpenSidebar}
                />
              </div>
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
