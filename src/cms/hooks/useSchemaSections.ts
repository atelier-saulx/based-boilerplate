import { useQuery } from '@based/react'
import { capitalize } from '@based/ui'

export const useSchemaSections = () => {
  const schema = useQuery('schema')
  if (schema.data) {
    const sections: {
      section: string
      description: string
      type: string
      disableAdd: boolean
    }[] = []

    for (const type in schema.data.types) {
      sections.push({
        section: capitalize(type),
        description: '',
        type: type,
        disableAdd: false,
      })
    }

    return sections
  }

  return []
}
