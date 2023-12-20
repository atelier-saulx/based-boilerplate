import React from 'react'
import { styled } from 'inlines'
import { color, Button, Text } from '@based/ui'
import { prettyDate } from '@based/pretty-date'
import { useRoute } from 'kabouter'

export const PublishSideBar = ({
  updatedAt,
  updatedBy,
  onClick,
  someThingChanged,
  setSomeThingChanged,
}) => {
  const route = useRoute('[section][id]')
  const section = route.query.section

  return (
    <styled.div
      style={{
        minWidth: 224,
        minHeight: 'calc(100vh - 67px)',
        height: 'auto',
        backgroundColor: color('background', 'neutral', 'surface'),
        borderLeft: `1px solid ${color(
          'inputBorder',
          'neutralNormal',
          'default'
        )}`,
        padding: '24px ',
      }}
    >
      <Button
        style={{
          width: '100%',
          marginBottom: 24,
          pointerEvents: someThingChanged ? 'auto' : 'none',
          opacity: someThingChanged ? 1 : 0.5,
          cursor: someThingChanged ? 'pointer' : 'not-allowed',
        }}
        displayShortcut
        keyboardShortcut="Cmd+S"
        onClick={() => {
          onClick()
          setSomeThingChanged(false)
        }}
        // disabled={someThingChanged}
      >
        Publish
      </Button>
      <Button
        style={{
          width: '100%',
          marginBottom: 24,
          pointerEvents: someThingChanged ? 'auto' : 'none',
          opacity: someThingChanged ? 1 : 0.5,
          cursor: someThingChanged ? 'pointer' : 'not-allowed',
        }}
        color="system"
        onClick={() => {
          // TODO check if publish was succesfull
          onClick()
          // @ts-ignore
          route.setQuery({ section: section, id: null })
          setSomeThingChanged(false)
        }}
      >
        Publish & close
      </Button>
      <div style={{ marginBottom: 24 }}>
        <Text light>
          Last update: {prettyDate(updatedAt, 'date-time-human')}
        </Text>
        {updatedBy && <Text light>By: {updatedBy}</Text>}
      </div>
    </styled.div>
  )
}
