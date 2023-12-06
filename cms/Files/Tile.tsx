import React, { useState } from 'react'
import { styled } from 'inlines'
import { IconFile, IconFolder, Input, Text, color } from '@based/ui'

export const Tile = ({ folder, name, setOpenSidebar, id, setSelected }) => {
  const [editName, setEditName] = useState(false)

  return (
    <styled.button
      // onClick={() => console.log('NOOO')}
      style={{
        maxHeight: 128,
        maxWidth: 80,
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
        '&:focus': {
          background: color('action', 'system', 'subtleSelected'),
        },
        '&:hover': {
          background: color('action', 'system', 'subtleHover'),
        },
        '&:active': {
          background: color('action', 'system', 'subtleActive'),
        },
      }}
      onClick={
        !editName
          ? () => {
              setEditName(true)
              setSelected(id)
            }
          : () => setOpenSidebar(true)
      }
    >
      <styled.div
        style={{
          height: 80,
          width: '100%',
          '& svg': {
            width: '80px',
            height: '80px',
          },
        }}
      >
        {folder ? (
          <IconFolder style={{ width: '100%', height: '100%' }} />
        ) : (
          <IconFile style={{ width: '100%', height: '100%' }} />
        )}
      </styled.div>
      <div
        style={{ width: '100%' }}
        onClick={(e) => {
          // e.preventDefault()
          // e.stopPropagation()
        }}
      >
        {editName ? (
          <styled.div
            autoFocus
            type="text"
            onBlur={() => setEditName(false)}
            // contentEditable
            style={{
              border: 'none',
              fontSize: 14,
              width: '80px',
              maxHeight: '100%',
              flexGrow: 0,
              overflow: 'visible',
              overflowWrap: 'break-word',
              color: color('content', 'default'),
              backgroundColor: 'transparent',
            }}
          >
            {name}
          </styled.div>
        ) : (
          <Text truncate={2} selectable="none">
            {name}
          </Text>
        )}
      </div>
    </styled.button>
  )
}
