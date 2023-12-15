import React from 'react'
import { prettyDate } from '@based/pretty-date'
import { prettyNumber } from '@based/pretty-number'
import { styled } from 'inlines'
import {
  Text,
  Badge,
  Thumbnail,
  IconAttachment,
  Toggle,
  Avatar,
} from '@based/ui'

export const RenderAs = ({ colName, input, cellFieldTypeOf, selectedLang }) => {
  let cName = colName.toLowerCase()

  if (cName === 'id') {
    return (
      <Badge light autoColor copy>
        {input}
      </Badge>
    )
  } else if (cellFieldTypeOf === 'text') {
    return <Text>{input && input[selectedLang]}</Text>
  } else if (
    cName === 'createdat' ||
    cName === 'updatedat' ||
    cellFieldTypeOf === 'timestamp'
  ) {
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
  } else if (cName === 'profileimg') {
    return <Avatar src={input} autoColor />
  }

  return <Text truncate>{input}</Text>
}
