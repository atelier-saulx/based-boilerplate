import React, { useEffect, useState } from 'react'
import { styled } from 'inlines'
import { Text, Input, Button } from '@based/ui'
import { languages as allLangs } from '../../Components/assets/languages'
import { useClient } from '@based/react'
// import { client } from '../../../client'

export const GeneralSettings = ({ languages }) => {
  const langKeys = Object.keys(allLangs)
  const options = langKeys.map((item) => ({
    label: allLangs[item],
    value: item,
  }))

  const [tempLangs, setTempLangs] = useState('')

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
            }}
            options={options}
          />
        )}
        <Button
          size="small"
          style={{ marginTop: 12 }}
          onClick={async () => {
            // const itemsToBeRemoved = languages.filter(
            //   (item) => !tempLangs?.includes(item)
            // )

            // //  TODO : remove languages
            // console.log('ITEMS to be removed', itemsToBeRemoved)

            // remove items that need to be removed first
            // await client.call('db:set-schema', {
            //   mutate: true,
            //   schema: {
            //     languages: {
            //       $delete: itemsToBeRemoved,
            //     },
            //   },
            // })

            await client.call('db:set-schema', {
              mutate: true,
              schema: {
                languages: tempLangs,
              },
            })
          }}
          disabled={languages === tempLangs}
        >
          Set Languages
        </Button>
        {JSON.stringify(tempLangs)}
      </styled.div>
    </styled.div>
  )
}
