import React, { useEffect, useReducer, useRef, useState } from 'react'
import { styled } from 'inlines'
import { Tile } from './Tile'
import {
  Button,
  FormGroup,
  SidePanel,
  Breadcrumbs,
  color,
  Modal,
  IconClose,
} from '@based/ui'
import { useClient, useQuery } from '@based/react'
import { useRoute } from 'kabouter'
import { Search } from './Search'
import { FileDrop } from 'react-file-drop'
import './FileCss.css'
import { useUploadFile } from 'Hooks/useUploadFile'

const FILTER_FIELDS = ['type', 'ancestors', 'descendants', 'aliases']

const filterFolder = (data, rootId) => {
  if (data?.length < 1) return
  const newArr = [] as any
  const indexed = [] as any
  const unindexed = [] as any
  for (const i in data) {
    const parents = data[i].parents.filter(
      (i) => i === 'root' || i.slice(0, 2) === 'di'
    )
    if (parents[0] === rootId) {
      // if (true) {
      newArr.push(data[i])
    }
  }
  for (const i in newArr) {
    if (newArr[i].tempOrder) {
      indexed.push(newArr[i])
    } else {
      unindexed.push(newArr[i])
    }
  }
  indexed.sort(function (a, b) {
    return a.tempOrder - b.tempOrder
  })

  return [...indexed, ...unindexed]
}

export const Explorer = ({ onChange }) => {
  const route = useRoute('[folder]')
  const path = route.query.folder as string

  const [section, setSection] = useState(path.split('/').slice(-1)[0])

  useEffect(() => {
    setSection(path.split('/').slice(-1)[0])
  }, [path])

  const dragOverItem = useRef<string>()
  const containerRef = useRef<any>()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const onFileInputChange = (event) => {
    const { files } = event.target
    console.log(files)
  }

  const { data, loading: dataLoading } = useQuery('db', {
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

  const handleDrop = async (id) => {
    setDragging(false)
    if (!dragOverItem.current || dragOverItem.current.length < 1) {
      return
    }
    const prefix = dragOverItem.current?.slice(0, 2)
    if (prefix === 'di' && id !== dragOverItem.current) {
      await client
        .query('db', {
          $id: dragOverItem.current,
          children: true,
        })
        .get()
        .then(
          async (res) =>
            await client.call('db:set', {
              $id: dragOverItem.current,
              children: [...res.children, id],
            })
        )
        .catch((e) => console.log('error', e))
    } else {
      if (id !== dragOverItem.current) {
        const items = filterFolder(data.files, section) as any

        const activeIndex = items?.findIndex((item) => item.id === id) as number
        const overIndex =
          dragOverItem.current !== 'last'
            ? (items?.findIndex(
                (item) => item.id === dragOverItem.current
              ) as number)
            : items.length

        if (activeIndex > overIndex) {
          items.splice(overIndex, 0, items[activeIndex])
          items.splice(activeIndex + 1, 1)
        } else if (activeIndex < overIndex) {
          items.splice(overIndex + 1, 0, items[activeIndex])
        }

        for (const i in items) {
          items[i].tempOrder = i
        }

        for (const i in items) {
          client.call('db:set', {
            $id: items[i].id,
            //temporder should be index type instead but for some reason this doenst want to cooperate if its a string???
            tempOrder: items[i].tempOrder,
          })
        }
      }
    }
    dragOverItem.current = ''
  }

  const [isDragging, setDragging] = useState(false)

  const dragStart = (e, index) => {
    if (e.button !== 0) return
    setDragging(true)
    const container = containerRef.current
    const items = [...container.childNodes]
    const otherItems = items.filter((_, i) => i !== index)

    const dragItem = items[index]

    const dragBoundingRect = dragItem.getBoundingClientRect()
    items.forEach((item) => {
      const { top, left } = item.getBoundingClientRect()
      item.style.top = top + 'px'
      item.style.left = left + 'px'
      item.style.position = 'aboslute'
    })

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

      for (const item of otherItems) {
        const upper = dragItem.getBoundingClientRect()
        const over = item.getBoundingClientRect()

        let collision =
          item.id !== 'last'
            ? upper.y < over.y + over.height / 2 &&
              upper.y + upper.height / 2 > over.y &&
              upper.x < over.x + over.width / 2 &&
              upper.x + upper.width / 2 > over.x
            : upper.y < over.y + over.height / 2 &&
              upper.y + upper.height / 2 > over.y &&
              upper.x < over.x + over.width &&
              upper.x + upper.width > over.x

        if (collision) {
          if (item.id !== 'last') {
            item.style.background = color('action', 'system', 'subtleActive')
          }
          dragOverItem.current = item.id
          break
        } else {
          item.style.background = ''
          dragOverItem.current = ''
        }
      }
    }

    document.onpointerup = dragEnd
    function dragEnd() {
      document.onpointerup = null
      document.onpointermove = null
      otherItems.forEach((item) => {
        item.style.position = 'static'
      })
      otherItems.forEach((item) => {
        item.style.background = ''
      })
      dragItem.style = ''
      dragItem.maxHeight = '130px'

      dragItem.style.cursor = 'pointer'
      handleDrop(dragItem.id)
    }
  }

  const [openSidebar, setOpenSidebar] = useState(false)
  const [openSearch, setOpenSearch] = useState(false)
  const [selected, setSelected] = useState('')
  const [formFieldChanges, setFormFieldChanges] = useState<any>({})
  const client = useClient()

  const { data: schema, loading } = useQuery('db:schema')

  let schemaFields = schema?.types.file.fields
  let filteredSchemaFields = {}
  if (schema) {
    for (const [key, value] of Object.entries(schemaFields)) {
      if (!FILTER_FIELDS.includes(key)) {
        filteredSchemaFields[key] = value
      }
    }
  }

  const { data: fileData, loading: loadingFile } = useQuery('db', {
    $id: selected,
    $all: true,
  })

  const fileOverlay = () => {
    const arr = [] as any
    // for (const i in data?.files) {
    for (let i = 0; i < 50; i++) {
      arr.push(
        <styled.div
          style={{
            height: 130,
            width: '120px',
            '&:hover': {
              borderRight: '1px solid red',
              // backgroundColor: 'red',
            },
            // paddingLeft: 15,
            // paddingRight: 15,
          }}
        />
      )
    }
    return arr
  }

  return (
    <styled.div style={{ position: 'relative', height: '100%' }}>
      <Breadcrumbs
        data={Object.fromEntries(path.split('/').map((i) => [i, i]))}
        onChange={(v) => {
          const pathArr = path.split('/')
          const newArr = [] as string[]
          for (const i in pathArr) {
            if (pathArr[i] === v) {
              newArr.push(pathArr[i])
              break
            } else {
              newArr.push(pathArr[i])
            }
          }

          route.setQuery({ folder: newArr.join('/') })
        }}
      />

      <input
        type="file"
        style={{ display: 'none' }}
        onChange={onFileInputChange}
        ref={fileInputRef}
      />
      <FileDrop
        // onFrameDragEnter={(event) => console.log('onFrameDragEnter', event)}
        // onFrameDragLeave={(event) => console.log('onFrameDragLeave', event)}
        // onFrameDrop={(event) => {
        //   console.log('onFrameDrop!', event)
        //   // setDragging(false)
        // }}
        // onDragOver={(event) => console.log('onDragOver', event)}
        // onDragLeave={(event) => {
        //   console.log('onDragLeave', event)
        //   setDragging(false)
        // }}
        onDrop={(files, event) => {
          console.log('dropped')
          for (const i in files) {
            onChange(files[i])
          }
        }}
      >
        <styled.div
          // onDrop={() => setDragging(false)}
          ref={containerRef}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            height: '100%',
            gap: 30,
            // gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 100px))',
          }}
        >
          {data?.files?.length > 0 &&
            //@ts-ignore
            filterFolder(data?.files, section).map((item, i) => {
              return (
                <div
                  key={item.id}
                  id={item.id}
                  onPointerDown={(e) => dragStart(e, i)}
                  style={{ maxHeight: 130 }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Tile
                      setOpenSearch={setOpenSearch}
                      folder={item.id?.slice(0, 2) === 'di'}
                      selected={item.id === selected}
                      item={item}
                      setOpenSidebar={setOpenSidebar}
                      setSelected={setSelected}
                    />
                  </div>
                </div>
              )
            })}
          <div id="last" style={{ flexGrow: 1 }} />
        </styled.div>
        {isDragging && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexWrap: 'wrap',
              overflow: 'hidden',
              // gridTemplateColumns: 'repeat( auto-fit, minmax(130px, 130px) )',
              gap: 30,
            }}
          >
            {fileOverlay()}
          </div>
        )}
      </FileDrop>
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
              config={schemaFields}
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
      <Modal.Root open={openSearch}>
        <Modal.Content style={{ maxWidth: undefined }}>
          <Modal.Title>
            <div style={{ display: 'flex' }}>
              More Items
              <Button
                style={{ marginLeft: 'auto', borderRadius: '50%' }}
                size="small"
                color="system"
                keyboardShortcut="Esc"
                onClick={() => setOpenSearch(false)}
                icon={<IconClose />}
              />
            </div>
          </Modal.Title>
          <Modal.Body>
            <Search />
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </styled.div>
  )
}
