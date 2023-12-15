import React, { useState } from 'react'
import {
  Dropdown,
  color as genColor,
  Text,
  Badge,
  Thumbnail,
  IconMoreHorizontal,
  Button,
  IconDragDropHorizontal,
  Row,
  IconChevronDown,
  IconChevronTop,
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
  setPathToEdit,
  id,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id })

  const [collapsed, setCollapsed] = useState(false)

  // console.log(item, '??')

  return (
    <div
      style={{
        position: 'relative',
        maxWidth: 676,
        width: '100%',
        marginLeft: 'auto',
      }}
    >
      <Dropdown.Root>
        {item.type === 'object' && (
          <styled.div style={{ position: 'absolute', right: 46, top: 11 }}>
            <AddField nestedObjectPath={[item.name]} />
          </styled.div>
        )}
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
            // marginRight: 'auto',
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
          <Row style={{ gap: 16 }}>
            {item.type === 'object' && (
              <Button
                style={{ marginRight: '-20px' }}
                ghost
                icon={collapsed ? <IconChevronTop /> : <IconChevronDown />}
                onClick={() => setCollapsed(!collapsed)}
              />
            )}
            <IconDragDropHorizontal style={{ marginLeft: 8 }} />
            <Thumbnail
              size="small"
              light
              icon={ALL_FIELDS[index]?.icon}
              color={ALL_FIELDS[index]?.color as any}
            />
            <Text weight="medium">{item.name}</Text>
            {item?.description && <Text light>{item?.description}</Text>}
            <Badge color={ALL_FIELDS[index]?.color as any} light>
              {item.type}
            </Badge>
            {/* meta index: {metaIndex} -- */}
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
        !collapsed &&
        Object.keys(item.properties).map((key) => {
          let objItem = item.properties[key]

          return (
            <NestedSchemaField
              objPath={[item.name]}
              objItem={objItem}
              key={key}
              ALL_FIELDS={ALL_FIELDS}
              deepness={1}
              setItemToEdit={setItemToEdit}
              setOpenEditModal={setOpenEditModal}
              setPathToEdit={setPathToEdit}
            />
          )
        })}
    </div>
  )
}

const NestedSchemaField = ({
  objItem,
  ALL_FIELDS,
  objPath,
  deepness,
  setItemToEdit,
  setOpenEditModal,
  setPathToEdit,
}) => {
  // console.log('🚑', objItem)
  // console.log(ALL_FIELDS)
  const [collapsed, setCollapsed] = useState(false)

  let deep = deepness + 1

  let path = objPath
  path.push(objItem?.meta.name)

  // console.log('NEW PATH =', path)
  // console.log('deepness', deep)

  const labels = ALL_FIELDS.map((item) => item.label.toLowerCase())
  const index = labels.indexOf(objItem.type)

  return (
    <div style={{ position: 'relative' }}>
      {objItem.type === 'object' && (
        <styled.div style={{ position: 'absolute', right: 46, top: 11 }}>
          <AddField nestedObjectPath={path} />
        </styled.div>
      )}

      <styled.div
        style={{
          padding: '6px',
          border: `1px solid ${genColor('inputBorder', 'neutralNormal')}`,
          backgroundColor: genColor('background', 'default'),
          borderRadius: 8,
          gap: 16,
          width: `calc(100% - ${deep * 3}%`,
          marginLeft: 'auto',
          marginBottom: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Row style={{ gap: 16 }}>
          {objItem.type === 'object' && (
            <Button
              style={{ marginRight: '-10px' }}
              ghost
              icon={collapsed ? <IconChevronTop /> : <IconChevronDown />}
              onClick={() => setCollapsed(!collapsed)}
            />
          )}
          <Thumbnail
            size="small"
            light
            icon={ALL_FIELDS[index]?.icon}
            color={ALL_FIELDS[index]?.color as any}
          />
          <Text weight="medium">{objItem?.name || objItem?.meta?.name}</Text>
          {objItem?.description && <Text light>{objItem?.description}</Text>}
          <Badge color={ALL_FIELDS[index]?.color as any} light>
            {objItem.type}
          </Badge>
          {objItem?.meta?.format && <Badge light>{objItem.meta.format}</Badge>}
          {objItem?.meta?.contentMediaEncoding && (
            <Badge light color="blue">
              {objItem.meta.contentMediaEncoding}
            </Badge>
          )}
          {objItem?.meta?.display && (
            <Badge light color="magenta">
              {objItem.meta.display}
            </Badge>
          )}
        </Row>

        <Dropdown.Root>
          <Dropdown.Trigger>
            <Button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
              size="small"
              // disabled={SYSTEM_FIELDS_LABELS.includes(
              //   item.name.toLowerCase()
              // )}
              ghost
              icon={<IconMoreHorizontal />}
            />
          </Dropdown.Trigger>
          <Dropdown.Items>
            <Dropdown.Item
              //@ts-ignore
              onClick={(e) => {
                setOpenEditModal(true)
                setItemToEdit(objItem.meta.name)
                setPathToEdit(path)
              }}
            >
              Edit
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                // setItemToEdit(item.name)
                // setOpenDeleteModal(true)
              }}
            >
              Delete
            </Dropdown.Item>
          </Dropdown.Items>
        </Dropdown.Root>
      </styled.div>
      {objItem.type === 'object' &&
        !collapsed &&
        Object.keys(objItem.properties).map((key) => {
          // console.log('🚒', objItem.properties[key])

          let x = objItem.properties[key]

          return (
            <NestedSchemaField
              objPath={[...path]}
              objItem={x}
              key={key}
              ALL_FIELDS={ALL_FIELDS}
              deepness={deep}
              setItemToEdit={setItemToEdit}
              setOpenEditModal={setOpenEditModal}
              setPathToEdit={setPathToEdit}
            />
          )
        })}
    </div>
  )
}
