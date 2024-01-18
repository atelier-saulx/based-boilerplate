import React from 'react'
import { SchemaEditor } from '@based/ui'
import { useQuery } from '@based/react'

export const SchemaBuilder = () => {
  const { data, loading: loadingSchema } = useQuery('db:schema')

  return <SchemaEditor schema={data || { types: { fields: {} } }} />
}
