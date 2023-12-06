import React, { useState } from 'react'
import { styled } from 'inlines'
import { Tile } from './Tile'
import { Button, FormGroup, SidePanel, scrollAreaStyle } from '@based/ui'
import { useClient, useQuery } from '@based/react'

const FILTER_FIELDS = ['type', 'ancestors', 'descendants', 'aliases']

export const Explorer = ({ data }) => {
  const [openSidebar, setOpenSidebar] = useState(false)
  const [selected, setSelected] = useState('')
  const [formFieldChanges, setFormFieldChanges] = useState<any>({})

  const client = useClient()
  const { data: schema, loading } = useQuery('db:schema')
  const { data: fileData, loading: loadingFile } = useQuery('db', {
    $id: selected,
    $all: true,
  })

  let schemaFields = schema?.types.file.fields
  let filteredSchemaFields = {}
  if (schema) {
    for (const [key, value] of Object.entries(schemaFields)) {
      if (!FILTER_FIELDS.includes(key)) {
        filteredSchemaFields[key] = value
      }
    }
  }
  console.log(selected, fileData)
  return (
    <styled.div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
        height: '100%',
        gap: 15,
      }}
    >
      {data.map((value, i) => (
        <Tile
          setSelected={setSelected}
          id={value.id}
          key={i}
          folder={false}
          name={value.name}
          setOpenSidebar={setOpenSidebar}
        />
      ))}
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
              config={filteredSchemaFields}
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
