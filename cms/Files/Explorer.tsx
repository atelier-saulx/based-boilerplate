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
  Text,
  Input,
  Breadcrumbs,
} from '@based/ui'
import { useClient, useQuery } from '@based/react'
import { arrayMove } from '@dnd-kit/sortable'
import { useRoute } from 'kabouter'

const FILTER_FIELDS = ['type', 'ancestors', 'descendants', 'aliases']

const filterFolder = (data, rootId) => {
  if (data?.length < 1) return
  const newArr = [] as any
  for (const i in data) {
    let bool = false
    data[i].parents.map((v) => {
      if (v.slice(0, 2) === 'di') {
        bool = true
      }
      if (v !== 'root' && v === rootId) {
        bool = false
      }
    })
    if (!bool) {
      newArr.push(data[i])
    }
  }
  return newArr
}

export const Explorer = ({}) => {
  const route = useRoute('[folder]')
  const section = route.query.folder
  const dragOverItem = useRef<string>()
  const containerRef = useRef<any>()

  const handleDrop = async (id) => {
    if (!dragOverItem.current || dragOverItem.current.length < 1) {
      return
    }
    const prefix = dragOverItem.current?.slice(0, 2)
    if (prefix === 'di' && id !== dragOverItem.current) {
      // console.log(dragOverItem.current)
      const childData = await client.call('db:get', {
        $id: dragOverItem.current,
        children: true,
      })
      await client.call('db:set', {
        $id: dragOverItem.current,
        children: [...childData.children, id],
      })
    } else {
      // setArray((items) => {
      //   // const activeIndex = items?.findIndex((item) => item.id === id) as number
      //   // const overIndex = items?.findIndex(
      //   //   (item) => item.id === dragOverItem.current
      //   // ) as number
      //   // return arrayMove(items, activeIndex, overIndex)
      // })
    }
  }

  const dragStart = (e, index) => {
    if (e.button !== 0) return

    const container = containerRef.current
    const items = [...container.childNodes]
    const otherItems = items.filter((_, i) => i !== index)

    const dragItem = items[index]
    // console.log(dragItem.id)

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
          if (item.id) {
            dragOverItem.current = item.id
          }
          // }
        }
      })
    }

    document.onpointerup = dragEnd
    function dragEnd() {
      document.onpointerup = null
      document.onpointermove = null
      otherItems.forEach((item) => {
        item.style.position = 'static'
      })

      dragItem.style = ''
      handleDrop(dragItem.id)
    }
  }

  const [openSidebar, setOpenSidebar] = useState(false)
  const [selected, setSelected] = useState('')
  const [formFieldChanges, setFormFieldChanges] = useState<any>({})
  const client = useClient()

  // console.log(section)

  const { data: schema, loading } = useQuery('db:schema')

  const [schemaData, setSchemaData] = useState()

  const { data: fileData, loading: loadingFile } = useQuery('db', {
    $id: selected,
    $all: true,
  })

  const { data, loading: dataLoading } = useQuery('db', {
    //@ts-ignore
    // $id: section.length > 0 ? section : 'root',
    $id: section,
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

  filterFolder(data?.files, section)
  const [path, setPath] = useState(['root'])

  // useEffect(() => {
  //   console.log('change')
  //   setArray(data)
  // }, [data])

  return (
    <styled.div>
      <Breadcrumbs
        data={Object.fromEntries(path.map((i) => [i, i]))}
        onChange={(v) => {
          route.setQuery({ folder: v })
          setPath(() => {
            const newArr = [] as string[]
            for (const i in path) {
              if (path[i] === v) {
                newArr.push(path[i])
                break
              }
              newArr.push(path[i])
            }
            // console.log(newArr)
            return newArr
          })
        }}
      />
      <Text onClick={() => route.setQuery({ folder: 'root' })}>
        {/* {section as string} */}

        {/* {path.map((i) => [i, i])} */}
      </Text>

      <styled.div
        ref={containerRef}
        style={{
          display: 'grid',
          // flexWrap: 'wrap',
          gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 100px))',
          height: '100%',
          gap: 15,
        }}
      >
        {data?.files?.length > 0 &&
          filterFolder(data?.files, section).map((item, i) => {
            return (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                key={item.id}
                id={item.id}
                onPointerDown={(e) => dragStart(e, i)}
              >
                <Tile
                  folder={item.id?.slice(0, 2) === 'di'}
                  selected={item.id === selected}
                  item={item}
                  path={path}
                  setPath={setPath}
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
              config={schema}
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
