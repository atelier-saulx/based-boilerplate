import React, { useState } from 'react'
import { styled } from 'inlines'
import { IconFile, IconFolder, Input, Text, color } from '@based/ui'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useRoute } from 'kabouter'

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
  item: { name, src, id },
  setOpenSidebar,
  folder,
  setSelected,
  selected,
}) => {
  const route = useRoute('[folder]')
  console.log(folder)

  return (
    <styled.div
      style={{
        height: '120px',
        width: '90px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: 8,
        borderRadius: 12,
        // border: dragOverItem.current === id ? '1px solid red' : '0px solid',

        // background: selected
        //   ? color('action', 'system', 'subtleSelected')
        //   : 'inital',

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
          : folder
          ? route.setQuery({ folder: 'di7e081f84' })
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
      <Text selectable="none">{name}</Text>
    </styled.div>
  )
}
