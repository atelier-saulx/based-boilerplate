import React from 'react'
import { styled } from 'inlines'
import { color, Text } from '@based/ui'
import string_screen from '../assets/img/string_screen.png'
import number_screen from '../assets/img/number_screen.png'

const StyledImg = styled('img', {
  maxWidth: 767,
  marginTop: 12,
  marginBottom: 6,
  border: `1px solid ${color('inputBorder', 'neutralNormal', 'default')}`,
})

export const Screenshots = ({ field }) => {
  if (field === 'String') {
    return (
      <>
        <StyledImg src={string_screen} />
        <Text>
          <i>SchemaType contains a field of type 'string'.</i>
        </Text>
      </>
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
      <>
        <StyledImg src={number_screen} />
        <Text>
          <i>SchemaType contains a field of type 'number'.</i>
        </Text>
      </>
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
