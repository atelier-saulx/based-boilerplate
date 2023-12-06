import React, { ReactNode, useState } from 'react'
import { styled } from 'inlines'
import {
  Button,
  IconPlus,
  Modal,
  Input,
  Text,
  Thumbnail,
  IconText,
  IconTurnOff,
  IconLayerThree,
  IconQuote,
  IconKey,
  IconDns,
  IconLink,
  IconTarget,
  Row,
  Column,
  color as genColor,
  ColorBackgroundColors,
  ColorNonSemanticBackgroundColors,
  IconTimeClock,
} from '@based/ui'
import { SpecificFieldModal } from './SpecificFieldModal'

export const SCHEMA_FIELDS = [
  {
    label: 'String',
    description: 'Non internationalized string',
    icon: <IconQuote />,
    color: 'brand',
  },
  {
    label: 'Text',
    description: 'Text with formatting',
    icon: <IconText />,
    color: 'brand',
  },
  {
    label: 'Rich Text',
    description: 'Stored as JSON and seperate field for HTML ',
    icon: <IconText />,
    color: 'brand',
  },
  {
    label: 'Number',
    description: 'A Float',
    icon: <IconText />,
    color: 'blue',
  },
  {
    label: 'Integer',
    description: 'Whole numbers',
    icon: <IconText />,
    color: 'blue',
  },
  {
    label: 'Enum',
    description: 'Set of named constants',
    icon: <IconText />,
    color: 'blue',
  },
  {
    label: 'Boolean',
    description: 'True or False',
    icon: <IconTurnOff />,
    color: 'green',
  },
  {
    label: 'Timestamp',
    description: 'Timestamp',
    icon: <IconTimeClock />,
    color: 'magenta',
  },
  {
    label: 'Array',
    description: 'A collection of similar types',
    icon: <IconLayerThree />,
    color: 'orange',
  },
  {
    label: 'Object',
    description: 'Multiple types',
    icon: <IconKey />,
    color: 'orange',
  },
  {
    label: 'Record',
    description: 'Fixed collection',
    icon: <IconDns />,
    color: 'orange',
  },
  {
    label: 'Set',
    description: 'Collection of unique values',
    icon: <IconText />,
    color: 'orange',
  },
  {
    label: 'JSON',
    description: 'A JSON object',
    icon: <IconText />,
    color: 'red',
  },
  {
    label: 'Reference',
    description: 'Single Ref',
    icon: <IconLink />,
    color: 'teal',
  },
  {
    label: 'References',
    description: 'Multiple Refs',
    icon: <IconLink />,
    color: 'teal',
  },
  {
    label: 'Cardinality',
    description: 'From math',
    icon: <IconTarget />,
    color: 'neutral',
  },
]

const SelectField = ({ label, description, icon, color, onClick }) => {
  return (
    <styled.div
      onClick={onClick}
      style={{
        display: 'inline-block',
        width: '50%',
        alignItems: 'center',
        cursor: 'pointer',
      }}
    >
      <Row
        style={{
          //  width: 'fit-content',
          borderRadius: 4,
          padding: 8,
          '&:hover': {
            backgroundColor: genColor('background', 'neutral', 'subtle'),
          },
        }}
      >
        <Thumbnail
          size="small"
          icon={icon}
          light
          color={color}
          style={{ marginRight: 12 }}
        />
        <Column>
          <Text weight="strong" style={{ marginBottom: '-4px' }}>
            {label}
          </Text>
          <Text light>{description}</Text>
        </Column>
      </Row>
    </styled.div>
  )
}

export const AddField = () => {
  const [searchValue, setSearchValue] = useState('')
  const [openSpecificFieldModal, setOpenSpecificFieldModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<{
    label: string
    icon: ReactNode
    color: ColorBackgroundColors | ColorNonSemanticBackgroundColors | any
  }>({
    label: '',
    icon: undefined,
    color: 'default',
  })

  return (
    <>
      <Modal.Root>
        <Modal.Trigger>
          <Button icon={<IconPlus />} size="small">
            Add Field
          </Button>
        </Modal.Trigger>
        <Modal.Content style={{ maxWidth: '767px' }}>
          {({ close }) => {
            return (
              <>
                <Modal.Title>Add a new field to your schema type.</Modal.Title>
                <Input
                  type="search"
                  placeholder="Search for a field..."
                  value={searchValue}
                  onChange={(v) => setSearchValue(v)}
                  style={{ marginTop: 16 }}
                />
                <Modal.Body>
                  <div>
                    {SCHEMA_FIELDS.filter(
                      (item) =>
                        item.label
                          .toLowerCase()
                          .includes(searchValue.toLowerCase()) ||
                        item.description
                          .toLowerCase()
                          .includes(searchValue.toLowerCase())
                    ).map((item, idx) => (
                      <SelectField
                        onClick={() => {
                          close()
                          setSelectedItem({
                            label: item.label,
                            icon: item.icon,
                            color: item.color,
                          })
                          setOpenSpecificFieldModal(true)
                        }}
                        key={idx}
                        label={item.label}
                        description={item.description}
                        icon={item.icon}
                        color={item.color}
                      />
                    ))}
                  </div>
                </Modal.Body>
              </>
            )
          }}
        </Modal.Content>
      </Modal.Root>

      {/* Edit  Modal */}
      <Modal.Root
        open={openSpecificFieldModal}
        onOpenChange={setOpenSpecificFieldModal}
      >
        <Modal.Content>
          <Modal.Title>
            <Row>
              <Thumbnail
                size="small"
                icon={selectedItem.icon}
                light
                color={selectedItem.color}
                style={{ marginRight: 12 }}
              />
              Add new {selectedItem.label}
            </Row>
          </Modal.Title>
          <SpecificFieldModal
            field={selectedItem.label}
            setOpenSpecificFieldModal={setOpenSpecificFieldModal}
          />
        </Modal.Content>
      </Modal.Root>
    </>
  )
}
