import React, { useEffect, useState } from 'react'
import { useAuthState, useClient, useQuery } from '@based/react'
import { styled } from 'inlines'
import { Action, Avatar, Confirmation, Container, Input } from '@based/ui'

export const Profile = () => {
  const client = useClient()
  const authState = useAuthState()
  const [email, setEmail] = useState('')
  const [profileImg, setPic] = useState('')
  const [name, setName] = useState('')

  const { data, loading } = useQuery('db', {
    $id: authState.userId,
    name: true,
    createdAt: true,
    email: true,
    profileImg: true,
    // $all: true,
  })

  useEffect(() => {
    if (data) {
      setEmail(data.email)
      setName(data.name)
      setPic(data.profileImg)
    }
  }, [data])
  console.log(authState)

  return (
    <styled.div
      style={{
        display: 'flex',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Container
        icon={<Avatar src={data?.profileImg}>{data?.name}</Avatar>}
        style={{
          maxWidth: '700px',
          width: '70%',
        }}
        description={data?.email}
        label={data?.name}
      >
        <styled.div
          style={{ gap: 12, display: 'flex', flexDirection: 'column' }}
        >
          {!loading && (
            <>
              <Input
                type="text"
                label="Name"
                onChange={(v) => setName(v)}
                value={name}
              />
              <Input
                type="text"
                label="Email"
                onChange={(v) => setEmail(v)}
                value={email}
              />
              <Input
                type="text"
                label="Profile Picture"
                onChange={(v) => setPic(v)}
                value={profileImg}
              />
            </>
          )}
          <div style={{ height: 24 }} />
          <Confirmation
            label="Save Changes"
            onConfirm={async () => {
              await client.call('db:set', {
                $id: authState.userId,
                name,
                email,
                profileImg,
              })
            }}
            onCancel={() => {
              setEmail(data.email)
              setName(data.name)
              setPic(data.profileImg)
            }}
          />
        </styled.div>
      </Container>
    </styled.div>
  )
}
