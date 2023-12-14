import React, { useState } from 'react'
import { styled } from 'inlines'
import {
  Button,
  Dropdown,
  IconDelete,
  IconFile,
  IconFolder,
  IconMoreHorizontal,
  Input,
  Text,
  color,
} from '@based/ui'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useRoute } from 'kabouter'
import { useClient } from '@based/react'

const isImage = (src) => {
  if (!src) return
  const suffix = src.split('.')[src.split('.').length - 1].toLowerCase()
  return (
    suffix === 'ico' ||
    suffix === 'png' ||
    suffix === 'jpg' ||
    suffix === 'jpeg' ||
    suffix === 'webp'
  )
}

export const Tile = ({
  item: { name: propName, src, id, parents },
  setOpenSidebar,
  folder,
  setSelected,
  selected,
}) => {
  const client = useClient()
  const route = useRoute('[folder]')
  const section = route.query.folder as string
  const [name, setName] = useState(propName)
  const [edit, setEdit] = useState(false)
  const [moving, setMoving] = useState(false)

  if (moving) return

  return (
    <styled.div
      style={{
        cursor: 'pointer',
        height: '130px',
        maxHeight: '130px',
        width: '120px',
        display: 'flex',
        alignItems: 'center',
        // overflow: 'hidden',
        // justifyContent: 'center',
        flexDirection: 'column',
        padding: 8,
        borderRadius: 12,
        // border: dragOverItem.current === id ? '1px solid red' : '0px solid',

        // background: selected
        //   ? color('action', 'system', 'subtleSelected')
        //   : 'inital',
        position: 'relative',
        '&:hover': {
          background: color('action', 'system', 'subtleHover'),
        },
        '&:active': {
          background: color('action', 'system', 'subtleActive'),
          cursor: 'grabbing',
        },
      }}
      onClick={
        !selected
          ? () => {
              setSelected(id)
            }
          : () => {
              if (folder) {
                route.setQuery({
                  folder: [...section.split('/'), id].join('/'),
                })
              } else {
                setOpenSidebar(true)
              }
            }
      }
    >
      <styled.div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 80,
          width: '100%',
          '& svg': {
            width: '100px',
            height: '80px',
            background: `center center no-repeat url("${src}")`,
            backgroundSize: 'contain',
          },
        }}
      >
        {folder ? (
          <IconFolder style={{ width: '100%', height: '100%' }} />
        ) : isImage(src) ? (
          <svg style={{ width: '100%', height: '100%' }} />
        ) : (
          <IconFile style={{ width: '100%', height: '100%' }} />
        )}
      </styled.div>
      <Dropdown.Root>
        <Dropdown.Trigger>
          <Button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
            size="xsmall"
            ghost
            icon={<IconMoreHorizontal />}
            style={{ position: 'absolute', top: 0, right: 0 }}
          />
        </Dropdown.Trigger>
        <Dropdown.Items>
          <Dropdown.Sub>
            <Dropdown.SubTrigger
              //@ts-ignore
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                console.log('red')
              }}
            >
              Move {folder ? 'folder' : 'file'} to
              <Dropdown.SubItems>
                {section
                  .split('/')
                  .filter((_, idx) => idx !== section.split('/').length - 1)
                  .map((j, index) => (
                    <span key={index}>
                      <Dropdown.Item
                        onClick={async () => {
                          const newArr = parents.filter(
                            (i) => i.slice(0, 2) !== 'di'
                          )
                          newArr.push(j)

                          client.call('db:set', {
                            $id: id,
                            parents: newArr,
                          })
                          setMoving(true)
                        }}
                      >
                        {j}
                      </Dropdown.Item>
                      {index !== section.split('/').length - 2 && (
                        <Dropdown.Separator />
                      )}
                    </span>
                  ))}
              </Dropdown.SubItems>
            </Dropdown.SubTrigger>
          </Dropdown.Sub>
          <Dropdown.Separator />
          <Dropdown.Item
            icon={<IconDelete color="negative" />}
            onClick={async () => {
              await client.call('db:delete', {
                $id: id,
              })
            }}
          >
            Delete {name}
          </Dropdown.Item>
        </Dropdown.Items>
      </Dropdown.Root>

      {edit ? (
        <styled.textarea
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
          onBlur={async () => {
            await client.call('db:set', {
              $id: id,
              name: name,
            })
            setEdit(false)
          }}
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            all: 'unset',
            cursor: 'text',
            width: '120px',
            fontSize: 14,
            textAlign: 'center',
            minHeight: '60px',
          }}
        />
      ) : (
        <styled.div
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setEdit(true)
          }}
          style={{
            userSelect: 'none',
            minWidth: '100%',
            fontSize: 14,
            textAlign: 'center',
            // width: '100%',
            overflow: 'hidden',
            // flexShrink:
            minHeight: '30px',
            // border: '1px solid red',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
            display: '-webkit-box',
          }}
        >
          {name ?? id}
        </styled.div>
      )}
    </styled.div>
  )
}
