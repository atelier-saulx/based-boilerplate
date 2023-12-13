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
  IconPlus,
  Row,
} from '@based/ui'
import { styled } from 'inlines'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { AddField } from './AddField'

export const SchemaField = ({
  ALL_FIELDS,
  SYSTEM_FIELDS_LABELS,
  item,
  index,
  setOpenEditModal,
  setOpenDeleteModal,
  setItemToEdit,
  id,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id })

  // console.log(item, '??')

  return (
    <>
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
            justifyContent: 'space-between',
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
          <Row style={{ gap: 12 }}>
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

            {item?.meta?.format && <Badge light>{item.meta.format}</Badge>}
            {item?.meta?.contentMediaEncoding && (
              <Badge light color="blue">
                {item.meta.contentMediaEncoding}
              </Badge>
            )}
            {item?.meta?.display && (
              <Badge light color="magenta">
                {item.meta.display}
              </Badge>
            )}
          </Row>

          <Row style={{ gap: 12 }}>
            {item.type === 'object' && (
              <AddField nestedObjectPath={[item.name]} />
            )}

            <Dropdown.Trigger>
              <Button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                size="small"
                disabled={SYSTEM_FIELDS_LABELS.includes(
                  item.name.toLowerCase()
                )}
                ghost
                icon={<IconMoreHorizontal />}
              />
            </Dropdown.Trigger>
          </Row>
        </styled.div>
        <Dropdown.Items>
          <Dropdown.Item
            //@ts-ignore
            onClick={(e) => {
              setOpenEditModal(true)
              setItemToEdit(item.name)
            }}
          >
            Edit
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              setItemToEdit(item.name)
              setOpenDeleteModal(true)
            }}
          >
            Delete
          </Dropdown.Item>
        </Dropdown.Items>
      </Dropdown.Root>

      {item.type === 'object' &&
        Object.keys(item.properties).map((key) => {
          // console.log('🚒', item.properties[key])

          let objItem = item.properties[key]

          return (
            <NestedSchemaField
              objItem={objItem}
              key={key}
              ALL_FIELDS={ALL_FIELDS}
            />
            // <SchemaField
            //   id={objItem?.id}
            //   ALL_FIELDS={ALL_FIELDS}
            //   SYSTEM_FIELDS_LABELS={SYSTEM_FIELDS_LABELS}
            //   index={index}
            //   item={objItem}
            //   setItemToEdit={setItemToEdit}
            //   setOpenEditModal={setOpenEditModal}
            //   setOpenDeleteModal={setOpenDeleteModal}
            //   key={key}
            // />
          )
        })}
    </>
  )
}

const NestedSchemaField = ({ objItem, ALL_FIELDS }) => {
  // console.log('🚑', objItem)
  // console.log(ALL_FIELDS)

  const labels = ALL_FIELDS.map((item) => item.label.toLowerCase())
  const index = labels.indexOf(objItem.type)
  // console.log(index)

  return (
    <styled.div
      style={{
        padding: '6px',
        border: `1px solid ${genColor('inputBorder', 'neutralNormal')}`,
        backgroundColor: genColor('background', 'default'),
        borderRadius: 8,
        gap: 16,
        maxWidth: 624,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Row style={{ gap: 16 }}>
        <Thumbnail
          size="small"
          light
          icon={ALL_FIELDS[index].icon}
          color={ALL_FIELDS[index].color as any}
        />
        <Text weight="medium">{objItem.name || objItem.meta.name}</Text>
        {objItem?.description && <Text light>{objItem?.description}</Text>}
        <Badge color={ALL_FIELDS[index].color as any} light>
          {objItem.type}
        </Badge>
      </Row>
    </styled.div>
  )
}
