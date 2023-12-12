import React from 'react'
import { ContentOverview } from './ContentOverview'
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
        <ContentOverview selectedLang={selectedLang} />
      ) : (
        ''
      )}
    </>
  )
}
