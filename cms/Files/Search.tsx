import React, { useState } from 'react'
import { styled } from 'inlines'
import { Input, Text, color } from '@based/ui'
import { useQuery } from '@based/react'

export type SearchProps = {
  onChange?: (v: string) => void
}

export const Branch = ({ data }) => {
  return (
    <styled.div>
      <Text>{data.name ?? data.id}</Text>
      {data?.children.map((i) => (
        <Branch data={i} />
      ))}
    </styled.div>
  )
}

export const Search = ({ onChange }: SearchProps) => {
  const [searchbar, setSearchbar] = useState('')
  const { data, loading } = useQuery('db', {
    $id: 'root',
    directories: {
      $all: true,
      parents: true,
      children: true,
      id: true,
      $list: {
        $find: {
          $traverse: 'children',
          $filter: {
            $operator: '=',
            $field: 'type',
            $value: 'folder',
          },
        },
      },
    },
  })

  const rootFolders = data?.directories
    .map((i) => {
      return {
        name: i.name,
        id: i.id,
        parents: i.parents.filter((i) => i !== 'root'),
        children: i.children,
      }
    })
    .filter((i) => i.parents.length === 0)

  console.log(rootFolders)

  return (
    <styled.div>
      <Input
        type="search"
        onChange={(v) => setSearchbar(v)}
        value={searchbar}
      />
      {/* <styled.div style={{ display: 'flex', flexDirection: 'column' }}>
        {rootFolders?.map((i) => (
          <Branch data={i} />
        ))}
      </styled.div> */}
    </styled.div>
  )
}
