import React from 'react'
import { Menu, IconFolder, IconUsers, IconSettings } from '@based/ui'
import { useRoute } from 'kabouter'
import { useQuery } from '@based/react'
// import { Logo } from './Logo'

export const SideBar = () => {
  const route = useRoute('[section]')
  const section = route.query.section

  const { data: schema, loading: loadingSchema } = useQuery('db:schema')

  let menuItems = {}

  if (schema) {
    let schemaTypes = schema?.types
    let schemaTypeKeys = Object.keys(schemaTypes).sort((a, b) =>
      a.localeCompare(b)
    )

    // console.log('test', schemaTypeKeys)

    schemaTypeKeys
      .filter((key) => key !== 'user')
      .filter((key) => key !== 'file')
      .map((key) => {
        if (schemaTypes[key].parents) {
          menuItems[schemaTypes[key].parents][key] = [
            {
              value: key,
              label: schemaTypes[key]?.meta?.displayName || key,
            },
          ]
        } else {
          menuItems[key] = {
            value: key,
            label: schemaTypes[key]?.meta?.displayName || key,
          }
        }
      })
  }

  console.log(menuItems)

  // let testa = {
  //   flipper: { value: 'flipper', label: 'flipper' },
  //   flapper: { value: 'flapper', label: 'flapper' },

  //   boink: [
  //     {
  //       label: 'boink',
  //       value: 'boink',
  //     },
  //   ],
  // }

  return (
    <Menu
      style={{ paddingTop: 90, minHeight: '100vh' }}
      // header={<Logo />}

      config={{
        types: menuItems,
        schema: {
          ['schema-builder']: {
            // @ts-ignore
            value: 'schema-builder',
            label: 'Schema Builder',
            icon: <IconSettings />,
          },
        },
        files: {
          ['file-library']: {
            value: 'file-library',
            label: 'File Library',
            icon: <IconFolder />,
          },
        },
        users: {
          ['user-management']: {
            value: 'user-management',
            label: 'User Management',
            icon: <IconUsers />,
          },
        },
      }}
      onChange={(v) => {
        // @ts-ignore
        route.setQuery({ section: v, type: null, id: null })
      }}
      active={section}
    />
  )
}
