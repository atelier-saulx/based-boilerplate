import React from 'react'
import { styled } from '@based/ui'
import { Text, color } from '@based/ui'

const StyledTable = styled('table', {
  marginTop: 24,
  fontSize: '14px',
  lineHeight: '20px',
  borderSpacing: 0,
  '& tr:nth-child(odd)': {
    background: color('background', 'neutral', 'surface'),
    // borderBottom: `1px solid ${color(
    //   'inputBorder',
    //   'neutralNormal',
    //   'default'
    // )}`,
    border: '1px solid red !important',
  },
  '& tr td:first-child': {
    fontWeight: '600',
    minWidth: '164px',
  },
  '& tr td:last-child': {
    color: color('content', 'default', 'secondary'),
  },

  '& td': {
    padding: '8px 12px',
  },
})

const SharedOptions = () => {
  return (
    <>
      {' '}
      <tr>
        <td>name</td>
        <td>api field name used in the sdk and clients</td>
      </tr>
      <tr>
        <td>Display name</td>
        <td>cms display name</td>
      </tr>
      <tr>
        <td>Description</td>
        <td>description for in the cms</td>
      </tr>
      <tr>
        <td>Is Required</td>
        <td>this field can'be empty</td>
      </tr>
      <tr>
        <td>Read only</td>
        <td></td>
      </tr>
      <tr>
        <td>Write only</td>
        <td></td>
      </tr>
    </>
  )
}

export const FieldOptions = ({ field }) => {
  if (field === 'String') {
    return (
      <>
        <StyledTable>
          <SharedOptions />
          <tr>
            <td>Format</td>
            <td>
              'email' | 'URL' | 'MACAddress' | 'IP' | 'IPRange' | 'FQDN' |
              'IBAN' | 'BIC' | 'alpha' | 'alphaLocales' | 'alphanumeric' |
              'alphanumericLocales' | 'passportNumber' | 'port' | 'lowercase' |
              'uppercase' | 'ascii' | 'semVer' | 'surrogatePair' | 'IMEI' |
              'hexadecimal' | 'octal' | 'hexColor' | 'rgbColor' | 'HSL' | 'ISRC'
              | 'MD5' | 'JWT' | 'UUID' | 'luhnNumber' | 'creditCard' |
              'identityCard' | 'EAN' | 'ISIN' | 'ISBN' | 'ISSN' | 'mobilePhone'
              | 'mobilePhoneLocales' | 'postalCode' | 'postalCodeLocales' |
              'ethereumAddress' | 'currency' | 'btcAddress' | 'ISO6391' |
              'ISO8601' | 'RFC3339' | 'ISO31661Alpha2' | 'ISO31661Alpha3' |
              'ISO4217' | 'base32' | 'base58' | 'base64' | 'dataURI' |
              'magnetURI' | 'mimeType' | 'latLong' | 'slug' | 'strongPassword' |
              'taxID' | 'licensePlate' | 'VAT'
            </td>
          </tr>
          <tr>
            <td>Min Chars</td>
            <td>Minimal amount of required characters.</td>
          </tr>
          <tr>
            <td>Max Chars</td>
            <td>Maximum amount of required characters.</td>
          </tr>
          <tr>
            <td>Match pattern</td>
            <td>Should a specific Regex pattern be matched.</td>
          </tr>
          <tr>
            <td>Content Media Types</td>
            <td>
              'text/html' | 'text/plain' | 'text/markdown' | 'image/png' |
              'image/jpeg' | 'video/mp4' | 'image/*' | 'video/*' | 'audio/*' |
              '*/*' | Custom
            </td>
          </tr>
          <tr>
            <td>Content Media Encoding</td>
            <td>
              7bit | 8bit | binary | quoted-printable | base16 | base32 | base64
            </td>
          </tr>
          <tr>
            <td>String Display Format</td>
            <td>lowercase | uppercase | capitalize</td>
          </tr>
          <tr>
            <td>Multiline</td>
            <td>should the text input be mulitple lines</td>
          </tr>
        </StyledTable>
      </>
    )
  }

  if (field === 'Text') {
    return <></>
  }
  if (field === 'Rich Text') {
    return <>xx</>
  }
  if (field === 'Number') {
    return (
      <>
        <StyledTable>
          <SharedOptions />
          <tr>
            <td>Minimum</td>
            <td>Minimum required value</td>
          </tr>
          <tr>
            <td>Maximum</td>
            <td>Maximum required value</td>
          </tr>
          <tr>
            <td>Multiple of</td>
            <td>Value must be a multiple of a certain number</td>
          </tr>
          <tr>
            <td>Exclusive Maximum</td>
            <td></td>
          </tr>
          <tr>
            <td>Exclusive Minimum</td>
            <td></td>
          </tr>
          <tr>
            <td>Display Format</td>
            <td>
              short | human | ratio | bytes | euro | dollar | pound |
              round-number
            </td>
          </tr>
        </StyledTable>
      </>
    )
  }
  if (field === 'Int') {
    return <></>
  }
  if (field === 'Enum') {
    return <></>
  }
  if (field === 'Boolean') {
    return <></>
  }
  if (field === 'Timestamp') {
    return <></>
  }
  if (field === 'Array') {
    return <></>
  }
  if (field === 'Object') {
    return <></>
  }
  if (field === 'Record') {
    return <></>
  }
  if (field === 'Set') {
    return <></>
  }
  if (field === 'JSON') {
    return <></>
  }
  if (field === 'Reference') {
    return <></>
  }
  if (field === 'References') {
    return <></>
  }
  if (field === 'Cardinality') {
    return <></>
  }
}
