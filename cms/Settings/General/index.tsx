import React, { useEffect, useState } from 'react'
import { styled } from 'inlines'
import { Text, Input, Button } from '@based/ui'
import { languages as allLangs } from '../../Components/TopBar/languages'
import { useClient } from '@based/react'

export const GeneralSettings = ({ languages }) => {
  const langKeys = Object.keys(allLangs)
  const options = langKeys.map((item) => ({
    label: allLangs[item],
    value: item,
  }))

  const [tempLangs, setTempLangs] = useState('')
  console.log('incoming lang', languages)

  useEffect(() => {
    setTempLangs(languages)
  }, [languages])

  const client = useClient()

  return (
    <styled.div style={{ padding: '24px 48px', width: '100%' }}>
      <div
        style={{
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 32,
        }}
      >
        <Text size={24} weight="strong" style={{ marginBottom: 24 }}>
          General settings
        </Text>
      </div>

      {/* set languages */}
      <styled.div style={{ maxWidth: 700 }}>
        {languages && tempLangs && (
          // @ts-ignore
          <Input
            value={tempLangs}
            type="multi-select"
            label="Set your schema languages"
            onChange={(v) => {
              setTempLangs(v)
              console.log(tempLangs)
            }}
            options={options}
          />
        )}
        <Button
          size="small"
          style={{ marginTop: 12 }}
          onClick={async () => {
            // await client.call('db:set', {
            //   $language: tempLangs,
            // })
          }}
          disabled={languages === tempLangs}
        >
          Set Languages
        </Button>
      </styled.div>
    </styled.div>
  )
}
