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

export const Explorer = ({}) => {
  // const [dragOverItem, setDragOverItem] = useState()
  // const dragItem = useRef()
  // const [dragItem, setDragItem] = useState()
  const route = useRoute('[folder]')
  const section = route.query.folder
  const dragOverItem = useRef<string>()
  const containerRef = useRef<any>()

  const { data, loading: dataLoading } = useQuery('db', {
    //@ts-ignore
    $id: section.length > 0 ? section : 'root',
    files: {
      $all: true,
      parents: true,
      children: true,
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

  const handleDrop = async (id) => {
    if (!dragOverItem.current || dragOverItem.current.length < 1) {
      return
    }
    const prefix = dragOverItem.current.slice(0, 2)
    if (prefix === 'di') {
      console.log(dragOverItem.current)
      const childData = await client.call('db:get', {
        $id: dragOverItem.current,
        children: true,
      })
      await client.call('db:set', {
        $id: dragOverItem.current,
        children: [...childData.children, id],
      })
    } else {
      setArray((items) => {
        const activeIndex = items?.findIndex((item) => item.id === id) as number
        const overIndex = items?.findIndex(
          (item) => item.id === dragOverItem.current
        ) as number

        return arrayMove(items, activeIndex, overIndex)
      })
    }
  }

  const dragStart = (e, index) => {
    if (e.button !== 0) return
    // setDragItem(index)

    const container = containerRef.current
    const items = [...container.childNodes]
    const otherItems = items.filter((_, i) => i !== index)

    const dragItem = items[index]
    console.log(dragItem.id)

    const dragBoundingRect = dragItem.getBoundingClientRect()
    items.forEach((item) => {
      const { top, left } = item.getBoundingClientRect()
      item.style.top = top + 'px'
      item.style.left = left + 'px'
      item.style.position = 'aboslute'
    })

    // dragItem.style.position = 'fixed'
    dragItem.style.width = dragBoundingRect.width + 'px'

    dragItem.style.height = dragBoundingRect.height + 'px'
    dragItem.style.top = dragBoundingRect.top + 'px'
    dragItem.style.left = dragBoundingRect.left + 'px'
    dragItem.style.pointerevents = 'none'
    dragItem.style.cursor = 'grabbing'

    let x = e.clientX
    let y = e.clientY

    document.onpointermove = dragMove
    function dragMove(e) {
      setSelected('')
      const posX = e.clientX - x
      const posY = e.clientY - y
      // if (posX < 50 || posY < 50) {
      //   return
      // }
      dragItem.style.transform = `translate(${posX}px, ${posY}px)`

      otherItems.forEach((item) => {
        const upper = dragItem.getBoundingClientRect()
        const over = item.getBoundingClientRect()
        let collision =
          upper.y < over.y + over.height / 2 &&
          upper.y + upper.height / 2 > over.y &&
          upper.x < over.x + over.height / 2 &&
          upper.x + upper.height / 2 > over.x
        if (collision) {
          // if (item.getAttribute('style')) {
          //   item.style.transform = ''
          //   // index++
          // } else {
          // item.style.transform = `translateY(${200}px)`
          // item.style.background = 'green'
          if (item.id) {
            dragOverItem.current = item.id
          }
          // }
        }
      })
    }

    // dragItem.style.right = dragBoundingRect.right + 'px'
    // dragItem.style.bottom = dragBoundingRect.bottom + 'px'

    document.onpointerup = dragEnd
    function dragEnd() {
      document.onpointerup = null
      document.onpointermove = null
      otherItems.forEach((item) => {
        item.style.position = 'static'
      })
      // setDragItem(undefined)
      dragItem.style = ''
      handleDrop(dragItem.id)
    }
  }

  const [openSidebar, setOpenSidebar] = useState(false)
  const [selected, setSelected] = useState('')

  const [rootId, setRootId] = useState(['root'])

  const [formFieldChanges, setFormFieldChanges] = useState<any>({})
  const client = useClient()

  // console.log(section)

  useEffect(() => {
    setArray(data?.files)
  }, [data])

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
        ref={containerRef}
        id={rootId}
        style={{
          display: 'grid',
          // flexWrap: 'wrap',
          gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 100px))',
          height: '100%',
          gap: 15,
        }}
      >
        {array?.length > 0 &&
          array.map((item, i) => {
            return (
              <div
                style={{
                  // border: '1px solid red',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                key={item.id}
                id={item.id}
                // onMouseOver={() => console.log(item.name)}
                onPointerDown={(e) => dragStart(e, i)}
              >
                <Tile
                  folder={item.id.slice(0, 2) === 'di'}
                  selected={item.id === selected}
                  item={item}
                  setOpenSidebar={setOpenSidebar}
                  setSelected={setSelected}
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
}
