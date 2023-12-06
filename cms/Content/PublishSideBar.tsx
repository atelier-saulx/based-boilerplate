import React, { useEffect, useState } from 'react'
import { styled } from 'inlines'
import { color, Button, Text, Input, usePropState } from '@based/ui'
import { prettyDate } from '@based/pretty-date'
import { useRoute } from 'kabouter'

export const PublishSideBar = ({
  updatedAt,
  onClick,
  someThingChanged,
  setSomeThingChanged,
}) => {
  const route = useRoute('[section][id]')
  const section = route.query.section

  console.log(someThingChanged, 'what the f')

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
        // disabled={someThingChanged}

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
      <Text light style={{ marginBottom: 24 }}>
        Last update: {prettyDate(updatedAt, 'date-time-human')}
      </Text>
      <Input
        label="Language"
        type="select"
        options={[{ value: 'en', label: 'en' }]}
      />
    </styled.div>
  )
}
