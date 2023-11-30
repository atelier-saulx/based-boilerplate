import React, { useMemo, useState } from 'react'
import { styled } from 'inlines'
import { Button, Container, Input, Tabs, Tab, Text } from '@based/ui'
import { Logo } from '../Sidebar/Logo'
import { useClient, useQuery } from '@based/react'

export const Login = () => {
  const code = useMemo(() => (~~(Math.random() * 1e6)).toString(16), [])
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
        description="description"
        label="label"
      >
        {code}
        {data?.user.length === 0 ? (
          <Text>
            No users found, please input credentials to create a first user
          </Text>
        ) : (
          'wanan login'
        )}
        <styled.div
          style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
        >
          {data?.user.length === 0 && (
            <Input type="text" label="Name" onChange={(v) => setName(v)} />
          )}
          <Input type="text" label="Email" onChange={(v) => setEmail(v)} />
          <div style={{ height: 12 }} />
          <Button
            size="large"
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
