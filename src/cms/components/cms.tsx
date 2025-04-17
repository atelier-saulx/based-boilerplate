import { useClient } from '@based/react'
import { Cms } from '@based/ui'
import { useSchemaSections } from '../hooks/useSchemaSections.js'
import { NavBar } from './navbar.js'

export default () => {
  const client = useClient()
  const sections = useSchemaSections()

  return (
    <Cms
      base="/cms"
      client={client}
      leadComponent={<NavBar name="CMS" sections={sections} />}
    >
      <Cms.Tab name="Types" icon="layers">
        <Cms.Group name="Types">
          {sections.map(({ description, ...item }, index) => (
            <Cms.Finder key={index} {...item} />
          ))}
        </Cms.Group>
      </Cms.Tab>
    </Cms>
  )
}
