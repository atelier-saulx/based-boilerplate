import * as React from 'react'
import { useClient } from '@based/react'

export function useUploadFile() {
  const client = useClient()
  const [status, setStatus] = React.useState<
    'initial' | 'uploading' | 'success' | 'error'
  >('initial')
  const [progress, setProgress] = React.useState(0)

  function handleFileInputChange(
    successHandler: (uploadedFile: { id: string; src: string } | null) => void
  ) {
    return async function (file?: File) {
      try {
        if (!file) {
          successHandler(null)
          return
        }
        setStatus('uploading')

        const { id, src } = await client.stream(
          'db:file-upload',
          {
            contents: file,
          },
          (value) => {
            setProgress(value * 100)
          }
        )

        setStatus('success')
        successHandler({ id, src })
      } catch {
        setStatus('error')
      }
    }
  }

  return { status, progress, handleFileInputChange }
}
