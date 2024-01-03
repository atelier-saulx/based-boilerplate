import React from 'react'
import { useRoute } from 'kabouter'
import { useQuery } from '@based/react'
import {
  Sidebar,
  SidebarGroup,
  SidebarItem,
  IconFolder,
  IconUsers,
  IconTimeClock,
  IconSettings,
  IconLayerThree,
} from 'better-ui'

export const MainMenu = () => {
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
        menuItems[key] = {
          value: key,
          label: schemaTypes[key]?.meta?.displayName || key,
        }
      })
  }

  const [active, setActive] = React.useState(section as string)

  return (
    <div style={{ height: 'calc(100vh - 65px)' }}>
      <Sidebar
        value={active}
        onChange={(v) => {
          setActive(v)
          // @ts-ignore
          route.setQuery({ section: v, type: null, id: null })
        }}
      >
        <SidebarGroup title="Types">
          {Object.keys(menuItems).map((item, idx) => (
            <SidebarItem value={menuItems[item].value} key={idx}>
              {menuItems[item].label}
            </SidebarItem>
          ))}
        </SidebarGroup>
        <SidebarGroup title="Schema">
          <SidebarItem value="schema-builder" icon={<IconLayerThree />}>
            Schema Builder
          </SidebarItem>
        </SidebarGroup>
        <SidebarGroup title="Files">
          <SidebarItem value="file-library" icon={<IconFolder />}>
            File library
          </SidebarItem>
        </SidebarGroup>
        <SidebarGroup title="Settings">
          <SidebarItem value="user-management" icon={<IconUsers />}>
            Users
          </SidebarItem>
          <SidebarItem value="db-settings" icon={<IconTimeClock />}>
            Database
          </SidebarItem>
          <SidebarItem value="general-settings" icon={<IconSettings />}>
            General
          </SidebarItem>
        </SidebarGroup>
      </Sidebar>
    </div>
  )
}
