import React from 'react'
import {
  Dropdown,
  color as genColor,
  Text,
  Badge,
  Thumbnail,
  IconMoreHorizontal,
  Button,
  IconDragDropVertical,
  IconDragDropHorizontal,
} from '@based/ui'
import { styled } from 'inlines'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export const SchemaField = ({
  onClick,
  ALL_FIELDS,
  SYSTEM_FIELDS_LABELS,
  item,
  index,
  setOpenEditModal,
  setItemToEdit,
  id,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id })

  return (
    <Dropdown.Root>
      <styled.div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={{
          padding: '6px',
          border: `1px solid ${genColor('inputBorder', 'neutralNormal')}`,
          backgroundColor: genColor('background', 'default'),
          borderRadius: 8,
          gap: 16,
          maxWidth: 676,
          // margin: '4px auto',
          cursor: 'grab',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginBottom: 8,
          display: 'flex',
          alignItems: 'center',
          opacity: SYSTEM_FIELDS_LABELS.includes(item.name.toLowerCase())
            ? 0.56
            : 1,
          transform: CSS.Transform.toString(transform),
          transition,
          '&:active': {
            cursor: 'grabbing',
          },
        }}
      >
        <IconDragDropHorizontal style={{ marginLeft: 8 }} />
        <Thumbnail
          size="small"
          light
          icon={ALL_FIELDS[index].icon}
          color={ALL_FIELDS[index].color as any}
        />
        <Text weight="medium">{item.name}</Text>
        {item?.description && <Text light>{item?.description}</Text>}
        <Badge color={ALL_FIELDS[index].color as any} light>
          {item.type}
        </Badge>

        <Dropdown.Trigger>
          <Button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
            size="small"
            disabled={SYSTEM_FIELDS_LABELS.includes(item.name.toLowerCase())}
            ghost
            icon={<IconMoreHorizontal />}
            style={{ marginLeft: 'auto' }}
          />
        </Dropdown.Trigger>
      </styled.div>
      <Dropdown.Items>
        <Dropdown.Item
          //@ts-ignore
          onClick={(e) => {
            //   e.preventDefault(e)
            //   e.stopPropagation(e)
            console.log('click')
            setOpenEditModal(true)
            console.log('item??', item)
            setItemToEdit(item.name)
          }}
        >
          Edit
        </Dropdown.Item>
        <Dropdown.Item onClick={onClick}>Delete</Dropdown.Item>
      </Dropdown.Items>
    </Dropdown.Root>
  )
}
