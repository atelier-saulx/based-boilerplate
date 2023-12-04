import React from 'react'
import { styled } from 'inlines'
import { color, Button, Text, Input } from '@based/ui'
import { prettyDate } from '@based/pretty-date'

export const PublishSideBar = ({ updatedAt, onClick }) => {
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
        style={{ width: '100%', marginBottom: 24 }}
        displayShortcut
        keyboardShortcut="Cmd+S"
        onClick={onClick}
      >
        Publish
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
