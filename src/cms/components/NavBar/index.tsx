import { useClient } from '@based/react'
import { Avatar, Button, Menu, Text, useCmsParams, useTheme } from '@based/ui'

export const normalize = (str: string) =>
  str?.toLowerCase().replaceAll(' ', '-')

export const NavBar: React.FC<{ name: string; sections: any[] }> = ({
  name,
  sections,
}) => {
  const { toggleTheme, theme } = useTheme()
  const client = useClient()
  const [_, go] = useCmsParams()

  return (
    <Menu>
      <Avatar label={name} color="red" />
      <Menu.Trigger>
        {({ open }) => (
          <Button
            trailIcon={open ? 'chevron-up' : 'chevron-down'}
            variant="ghost"
          >
            <Text color="neutral80" variant="display-medium">
              {name}
            </Text>
          </Button>
        )}
      </Menu.Trigger>
      <Menu.Items>
        <Menu.Header>{name}</Menu.Header>
        {sections.map((item, index) => (
          <Menu.Item
            key={index}
            leadIcon={item.icon}
            label={item.section}
            description={item.description}
            onClick={() => go({ section: normalize(item.section) }, true)}
          />
        ))}
        <Menu.Item
          leadIcon="boolean"
          label="Theme"
          description={`Set to ${theme === 'dark' ? 'light' : 'dark'}`}
          onClick={() => {
            toggleTheme()
          }}
          keepOpenOnClick
        />
        <Menu.Separator />
        <Menu.Item
          leadIcon="log-out"
          label="Logout"
          color="red"
          onClick={() => {
            client.setAuthState({})
          }}
        />
      </Menu.Items>
    </Menu>
  )
}
