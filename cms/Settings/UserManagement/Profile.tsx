import React, { useEffect, useState } from 'react'
import { useAuthState, useClient, useQuery } from '@based/react'
import { styled } from 'inlines'
import { Button, Container, TextInput, Thumbnail, Stack, Page } from '@based/ui'

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
  // console.log(authState)

  return (
    <Page>
      <Container
        prefix={
          <Thumbnail shape="circle" src={data?.profileImg} text={data?.name} />
        }
        style={{
          maxWidth: '700px',
          width: '70%',
        }}
        description={data?.email}
        title={data?.name}
      >
        <styled.div
          style={{ gap: 12, display: 'flex', flexDirection: 'column' }}
        >
          {!loading && (
            <>
              <TextInput
                label="Name"
                onChange={(v) => setName(v)}
                value={name}
              />
              <TextInput
                label="Email"
                onChange={(v) => setEmail(v)}
                value={email}
              />
              <TextInput
                label="Profile Picture"
                onChange={(v) => setPic(v)}
                value={profileImg}
              />
            </>
          )}
          <Stack gap={12} style={{ justifyContent: 'flex-end', marginTop: 24 }}>
            <Button
              variant="neutral"
              onClick={() => {
                setEmail(data.email)
                setName(data.name)
                setPic(data.profileImg)
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                const setObj = {
                  $id: authState.userId,
                  name: name,
                  email: email,
                  profileImg: profileImg ? profileImg : { $delete: true },
                }

                await client.call('db:set', setObj)
              }}
            >
              Save Changes
            </Button>
          </Stack>
        </styled.div>
      </Container>
    </Page>
  )
}
