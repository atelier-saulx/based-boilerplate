import React from 'react'
import { styled } from 'inlines'
import { Text } from '@based/ui'

export const FieldTemplate = ({ field }) => {
  return (
    <styled.div>
      <Text>Description</Text>
      <Text>Screenshots</Text>
      <Text>Settings</Text>
      <Text>Usage</Text>
    </styled.div>
  )
}
