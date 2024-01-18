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

type NumberFormat =
  | 'short'
  | 'human'
  | 'ratio'
  | 'bytes'
  | 'euro'
  | 'dollar'
  | 'pound'
  | `round-${number}`

export const RenderAs = ({
  colName,
  input,
  cellFieldTypeOf,
  selectedLang,
  displayAs,
}) => {
  let cName = colName.toLowerCase()

  // map displayAs to pretty number date and types

  if (cName === 'id') {
    return (
      <Badge light autoColor copy>
        {input}
      </Badge>
    )
  } else if (cellFieldTypeOf === 'text') {
    return <Text>{input && input[selectedLang]}</Text>
  } else if (cellFieldTypeOf === 'number' || cellFieldTypeOf === 'int') {
    return (
      <Text>
        {displayAs
          ? prettyNumber(input, `number-${displayAs as NumberFormat}`)
          : input}
      </Text>
    )
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