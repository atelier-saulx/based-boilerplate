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

  if (field === 'Text') {
    return <></>
  }
  if (field === 'Rich Text') {
    return <>xx</>
  }
  if (field === 'Number') {
    return (
      <Text>
        Primitive data type: number which can be storad as floating point
        numbers. Use if you need decimals.
      </Text>
    )
  }
  if (field === 'Int') {
    return <></>
  }
  if (field === 'Enum') {
    return <></>
  }
  if (field === 'Boolean') {
    return <></>
  }
  if (field === 'Timestamp') {
    return <></>
  }
  if (field === 'Array') {
    return <></>
  }
  if (field === 'Object') {
    return <></>
  }
  if (field === 'Record') {
    return <></>
  }
  if (field === 'Set') {
    return <></>
  }
  if (field === 'JSON') {
    return <></>
  }
  if (field === 'Reference') {
    return <></>
  }
  if (field === 'References') {
    return <></>
  }
  if (field === 'Cardinality') {
    return <></>
  }
}
