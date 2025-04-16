import { useClient } from '@based/react'
import { Cms, type IconProps } from '@based/ui'
import { NavBar } from '../NavBar/index.js'

export const MyCMS: React.FC = () => {
  const client = useClient()
  const sections: {
    icon: IconProps['variant']
    section: string
    description: string
    type: string
    disableAdd: boolean
  }[] = [
    {
      icon: 'user-setting',
      section: 'Users',
      description: 'Manage workspace',
      type: 'user',
      disableAdd: false,
    },
  ]

  return (
    <Cms
      base="/"
      client={client}
      leadComponent={<NavBar name="My CMS" sections={sections} />}
    >
      <Cms.Tab name="CMS" icon="layers">
        <Cms.Group name="Settings">
          {sections.map(({ description, ...item }, index) => (
            <Cms.Finder key={index} {...item} />
          ))}
        </Cms.Group>
      </Cms.Tab>
    </Cms>
  )
}
