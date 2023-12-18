import React from 'react'
import { Code, color } from '@based/ui'
import { styled } from 'inlines'
import Env from '../../../based.json'

export const ShowEnvWidget = () => {
  return (
    <styled.div
      style={{
        padding: '12px 24px',
        borderRadius: 8,
        border: `1px solid ${color('inputBorder', 'neutralNormal', 'default')}`,
        marginBottom: 24,
      }}
    >
      <Code language="json" value={JSON.stringify(Env, null, 2)} />
    </styled.div>
  )
}
