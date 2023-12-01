import React from 'react'
import { prettyDate } from '@based/pretty-date'
import { prettyNumber } from '@based/pretty-number'
import { styled } from 'inlines'
import { Text, Badge, Thumbnail, IconAttachment, Toggle } from '@based/ui'

export const RenderAs = ({ colName, input }) => {
  let cName = colName.toLowerCase()

  if (cName === 'id') {
    return (
      <Badge light autoColor copy>
        {input}
      </Badge>
    )
  } else if (cName === 'createdat' || cName === 'updatedat') {
    return <Text light>{prettyDate(input, 'date-time-human')}</Text>
  } else if (cName === 'size') {
    return <Text>{prettyNumber(input, 'number-bytes')}</Text>
  } else if (cName === 'src' || cName === 'thumb') {
    return (
      //TODO check if input ends with image extension i guess?
      <Thumbnail
        src={input}
        size="small"
        icon={
          input.match(/\.(jpg|jpeg|png|gif|svg)$/i) ? null : <IconAttachment />
        }
        light
      />
    )
  } else if (typeof input === 'boolean') {
    return <Toggle value={input} disabled />
  }

  return <Text truncate>{input}</Text>
}
