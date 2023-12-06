import React, { useState } from 'react'
import { styled } from 'inlines'
import { Tile } from './Tile'
import { Button, FormGroup, SidePanel, scrollAreaStyle } from '@based/ui'
import { useQuery } from '@based/react'

const FILTER_FIELDS = ['type', 'ancestors', 'descendants', 'id', 'aliases']

export const Explorer = ({ data }) => {
  const [openSidebar, setOpenSidebar] = useState(false)
  const [selected, setSelected] = useState('')

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
        // flexWrap: 'wrap',
        gap: 15,
        // overflow: 'wrap',
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
          <SidePanel.Title>Name</SidePanel.Title>

          <FormGroup
            values={fileData}
            //@ts-ignore
            style={{ padding: 40, paddingBottom: 180, ...scrollAreaStyle }}
            confirmationVariant="modal"
            config={filteredSchemaFields}
          />

          <SidePanel.Actions transparent>
            <Button
              keyboardShortcut="Shift+Esc"
              displayShortcut
              style={{ marginLeft: 0, marginRight: 'auto' }}
              onClick={() => setOpenSidebar(false)}
            >
              Close
            </Button>
          </SidePanel.Actions>
        </SidePanel.Content>
      </SidePanel.Root>
    </styled.div>
  )
}
