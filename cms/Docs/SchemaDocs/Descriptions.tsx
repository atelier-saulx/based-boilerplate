import React from 'react'
import { Text } from '@based/ui'

export const Description = ({ field }) => {
  if (field === 'String') {
    return (
      <Text>
        A non internationalized primitive data type used to store text data.
      </Text>
    )
  }
}
