import React, { useState } from 'react'
import { Logo } from '../MainMenu/Logo'
import { useRoute } from 'kabouter'
import { useAuthState, useQuery } from '@based/react'
import { languages as allLangs } from './languages'

import {
  Thumbnail,
  Stack,
  SelectInput,
  Dropdown,
  IconEye,
  IconLogOut,
  useTheme,
  border,
  color,
  useIsMobile,
} from 'better-ui'

export const TopBar = ({
  data,
  client,
  languages,
  selectedLang,
  setSelectedLang,
}) => {
  const route = useRoute('[section]')

  const isMobile = useIsMobile()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  const { data: userData } = useQuery('db', {
    $id: client.authState.userId,
    name: true,
  })

  const langOptions = languages?.map((lang) => ({
    value: lang,
    label: allLangs[lang],
  }))

  return (
    <header
      style={{
        height: 64,
        borderBottom: border(),
        background: color('background', 'screen'),
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        ...(isMobile &&
          mobileMenuOpen && {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 20,
          }),
      }}
    >
      <Logo
        style={{ cursor: 'pointer' }}
        onClick={() => {
          // @ts-ignore
          route.setQuery({ section: null })
        }}
      />

      <Stack style={{ marginLeft: 'auto' }}>
        <SelectInput
          value={selectedLang}
          options={langOptions || []}
          onChange={(v) => {
            console.log(v)
            setSelectedLang(v)
          }}
          style={{ width: 154, marginRight: 12, marginLeft: 'auto' }}
        />

        <Dropdown.Root>
          <Dropdown.Trigger>
            <Thumbnail
              shape="circle"
              size="regular"
              src={data?.profileImg}
              text={userData?.name}
              style={{ cursor: 'pointer' }}
            />
          </Dropdown.Trigger>
          <Dropdown.Items>
            <Dropdown.Item
              onClick={() =>
                //@ts-expect-error
                route.setQuery({ section: 'profile', type: null, id: null })
              }
            >
              Profile
            </Dropdown.Item>
            <Dropdown.Item
              icon={<IconEye />}
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                //@ts-expect-error
                route.setQuery({ section: null, type: null, id: null })
                client.setAuthState({ token: undefined, persistent: true })
              }}
              icon={<IconLogOut />}
            >
              Logout
            </Dropdown.Item>
          </Dropdown.Items>
        </Dropdown.Root>
      </Stack>
    </header>
  )
}
