import React from 'react'
import {
  Menu,
  IconFolder,
  IconUsers,
  IconTimeClock,
  IconSettings,
  IconLayerThree,
} from '@based/ui'
import { useRoute } from 'kabouter'
import { useQuery } from '@based/react'

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

    schemaTypeKeys
      .filter((key) => key !== 'user')
      .filter((key) => key !== 'file')
      .map((key) => {
        // if (schemaTypes[key].parents) {
        //   menuItems[schemaTypes[key].parents][key] = [
        //     {
        //       value: key,
        //       label: schemaTypes[key]?.meta?.displayName || key,
        //     },
        //   ]
        // } else {
        menuItems[key] = {
          value: key,
          label: schemaTypes[key]?.meta?.displayName || key,
        }
        // }
      })
  }

  return (
    <Menu
      style={{ paddingTop: 90, minHeight: '100vh' }}
      config={{
        types: menuItems,
        schema: {
          ['schema-builder']: {
            // @ts-ignore
            value: 'schema-builder',
            label: 'Schema Builder',
            icon: <IconLayerThree />,
          },
        },
        files: {
          ['file-library']: {
            value: 'file-library',
            label: 'File Library',
            icon: <IconFolder />,
          },
        },
        settings: {
          ['user-management']: {
            value: 'user-management',
            label: 'Users',
            icon: <IconUsers />,
          },
          ['database']: {
            value: 'db-settings',
            label: 'Database',
            icon: <IconTimeClock />,
          },
          ['general']: {
            value: 'general-settings',
            label: 'General',
            icon: <IconSettings />,
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
