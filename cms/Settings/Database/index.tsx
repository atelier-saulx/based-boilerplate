import React, { useEffect, useRef, useState } from 'react'
import { styled } from 'inlines'
import {
  Row,
  Text,
  Button,
  Container,
  Column,
  Input,
  Modal,
  IconUndo,
  IconDelete,
  IconDownload,
  IconCamera,
} from '@based/ui'
import { useClient, Provider } from '@based/react'

export const DatabaseSettings = () => {
  const [backups, setBackups] = useState()
  const [modalWarningInput, setModalWarningInput] = useState('')

  const client = useClient()

  // useQeury

  return (
    <styled.div style={{ padding: '24px 48px', width: '100%' }}>
      <div
        style={{
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 32,
        }}
      >
        <Text size={24} weight="strong" style={{ marginBottom: 24 }}>
          Database settings
        </Text>
        // TODO: Connect these
        <Column style={{ gap: 34, maxWidth: 700 }}>
          <Container
            label="Revert database to a backup"
            description="  Restore a backup from a certain moment in time. Backups get stored
            every 15 minutes."
            divider
          >
            <Row style={{ gap: 16 }}>
              <Input type="select" options={[]} />
              <Button size="small" icon={<IconUndo />} disabled>
                Revert to Backup
              </Button>
            </Row>
          </Container>

          <Container
            label="Backup data"
            description="This will create a remote snapshot of the current state of the database"
            divider
          >
            <Button size="small" icon={<IconCamera />}>
              Backup data
            </Button>
          </Container>

          <Container
            label="Download database backup"
            description="Download a specific backup file"
            divider
          >
            <Row style={{ gap: 16 }}>
              <Input type="select" options={[]} />
              <Button size="small" icon={<IconDownload />} disabled>
                Download Backup
              </Button>
            </Row>
          </Container>

          <Container
            label="Flush the database data"
            description="Flushing the database means all data will be deleted. This action cannot be undone."
            divider
          >
            <Modal.Root>
              <Modal.Trigger>
                <Button size="small" color="alert" icon={<IconDelete />}>
                  Flush database
                </Button>
              </Modal.Trigger>
              <Modal.Content>
                {({ close }) => (
                  <>
                    <Modal.Title>Flush Database</Modal.Title>
                    <Modal.Body>
                      <Text>
                        Are you sure you want to delete all the data in this
                        database?
                      </Text>
                      <Modal.Warning type="alert">
                        You are about to flush the database and delete all it's
                        content. Type <b>Flush DB</b> in the input field.
                      </Modal.Warning>
                      <Input
                        type="text"
                        value={modalWarningInput}
                        onChange={(v) => {
                          setModalWarningInput(v)
                        }}
                      />
                    </Modal.Body>
                    <Modal.Actions>
                      <Button onClick={close} color="system">
                        Cancel
                      </Button>
                      <Button
                        onClick={async () => {
                          // @ts-ignore
                          const data = await client.call('based:db-flush', {
                            db: 'default',
                          })
                          setModalWarningInput('')
                          close()
                        }}
                        color="alert"
                        disabled={modalWarningInput !== 'Flush DB'}
                      >
                        Flush
                      </Button>
                    </Modal.Actions>
                  </>
                )}
              </Modal.Content>
            </Modal.Root>
          </Container>
        </Column>
      </div>
    </styled.div>
  )
}
