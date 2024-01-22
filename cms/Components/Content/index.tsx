import React from 'react'
import { ContentViewer } from './ContentViewer'
import { ContentEditor } from './ContentEditor'
import { useRoute } from 'kabouter'

export const Content = ({ selectedLang }) => {
  const route = useRoute('[section][id]')
  const section = route.query.section
  const routeId = route.query.id as string

  return (
    <>
      {section && routeId ? (
        <ContentEditor id={routeId} section={section} />
      ) : section ? (
        <ContentViewer selectedLang={selectedLang} section={section} />
      ) : (
        ''
      )}
    </>
  )
}
