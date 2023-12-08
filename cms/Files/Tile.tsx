import React, { useState } from 'react'
import { styled } from 'inlines'
import { IconFile, IconFolder, Input, Text, color } from '@based/ui'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

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
  dragStart,
  folder,
  name,
  setOpenSidebar,
  id,
  setSelected,
  setRootId,
  rootId,
  src,
  dragEnter,
  onDragEnd,
  dragOverItem,
}) => {
  const [editName, setEditName] = useState(false)

  return (
    <styled.button
      draggable
      id={id}
      onDragEnd={(e) => onDragEnd(e)}
      onDragStart={(e) => {
        // console.log('asdasdasdasd')
        dragStart(e)
      }}
      onDragEnter={(e) => {
        // console.log('asdasdasdasd')
        dragEnter(e)
      }}
      style={{
        maxHeight: 128,
        maxWidth: 90,
        background: color('action', 'system', 'normal'),
        color: 'inherit',
        border: 'none',
        font: 'inherit',
        cursor: 'pointer',
        outline: 'inherit',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        // justifyContent: 'center',
        padding: 8,
        borderRadius: 12,
        // border: dragOverItem.current === id ? '1px solid red' : '0px solid',
        '&:focus': {
          background: color('action', 'system', 'subtleSelected'),
        },
        '&:hover': {
          background: color('action', 'system', 'subtleHover'),
        },
        '&:active': {
          background: color('action', 'system', 'subtleActive'),
          cursor: 'grabbing',
        },
      }}
      onBlur={() => setEditName(false)}
      onClick={
        !editName
          ? () => {
              setEditName(true)
              setSelected(id)
            }
          : folder
          ? () => setRootId([...rootId, id])
          : () => setOpenSidebar(true)
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
            width: '80px',
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
      <div
        style={{ width: '100%' }}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
      >
        <Text truncate={2} selectable="none">
          {name}
        </Text>
      </div>
    </styled.button>
  )
}
