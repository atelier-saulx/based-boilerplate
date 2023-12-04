import React, { useMemo, useState } from 'react'
import { styled } from 'inlines'
import { Button, Container, Input, Tabs, Tab, Text, Badge } from '@based/ui'
import { Logo } from '../Sidebar/Logo'
import { useClient, useQuery } from '@based/react'
import { useRoute } from 'kabouter'

export const Login = () => {
  const code = useMemo(() => (~~(Math.random() * 1e6)).toString(16), [])
  const route = useRoute('[section]')
  const section = route.query.section
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const client = useClient()
  const { data, loading } = useQuery('db', {
    user: {
      status: true,
      //   email: true,
      //   $all: true,
      $list: {
        $find: {
          $traverse: 'children',
          $filter: {
            $field: 'type',
            $operator: '=',
            $value: 'user',
          },
        },
      },
    },
  })

  return (
    <styled.div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
      }}
    >
      <Container
        icon={<Logo />}
        style={{ maxWidth: '700px', width: '70%' }}
        // label="CMS"
        // description="login"
      >
        <styled.div
          style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
        >
          <Text size={18} weight="strong">
            {data?.user.length === 0
              ? 'No users found, please input credentials to create a first user'
              : 'Login'}
          </Text>
          {data?.user.length === 0 && (
            <Input type="text" label="Name" onChange={(v) => setName(v)} />
          )}
          <Input type="text" label="Email" onChange={(v) => setEmail(v)} />
          <div style={{ height: 12 }} />
          <Badge color="brand">{code}</Badge>
          <Button
            size="large"
            keyboardShortcut="Enter"
            displayShortcut
            style={{ marginLeft: 'auto' }}
            onClick={
              data?.user.length === 0
                ? async () => {
                    await client
                      .call('register', { email, name })
                      .catch((e) => console.log(e))
                    setName('')
                    setEmail('')
                  }
                : async () => {
                    //@ts-ignore
                    route.setQuery({ section: null, type: null, id: null })
                    await client
                      .call('login', { email: email, displayCode: code })
                      .catch((e) => console.log(e))
                  }
            }
          >
            Login
          </Button>
        </styled.div>
      </Container>
    </styled.div>
  )
}
