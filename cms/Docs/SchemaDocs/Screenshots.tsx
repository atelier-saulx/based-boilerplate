import React from 'react'
import { styled } from 'inlines'
import { color, Text } from '@based/ui'
import string_screen from '../assets/img/string_screen.png'

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
}
