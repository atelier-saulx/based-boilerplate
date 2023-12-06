import React from 'react'
import { styled } from 'inlines'
import { Input } from '@based/ui'

// TODO: ???

// string
// text
// number
// integer
// enum
// boolean
// timestamp
// array
// object
// record
// set
// json
// reference
// references
// cardinality

type SpecificFieldSettingsProps = {
  fieldType: string
  setMeta: ({}) => void
  meta?: any
}

export const SpecificFieldSettings = ({
  fieldType,
  setMeta,
  meta,
}: SpecificFieldSettingsProps) => {
  return (
    // STRING
    <div style={{ display: 'grid', gap: 12 }}>
      {fieldType === 'string' ? (
        <>
          {/* <Input
            type="checkbox"
            label="Set field as unique"
            description="Ensures that multiple entries can't have the same value"
            value={meta?.unique}
            onChange={(v) => setMeta({ field: 'unique', value: v })}
          /> */}
          <Input
            type="select"
            label="Format"
            options={stringFormatOptions}
            value={meta?.format}
            onChange={(v) => setMeta({ field: 'format', value: v })}
          />
          <styled.div style={{ display: 'flex', gap: 16 }}>
            <Input
              type="number"
              label="Minimal number of characters"
              value={meta?.minChar}
              onChange={(v) => setMeta({ field: 'minChar', value: v })}
            />
            <Input
              type="number"
              label="Maximum number of characters"
              value={meta?.maxChar}
              onChange={(v) => setMeta({ field: 'maxChar', value: v })}
            />
          </styled.div>
          <Input
            type="text"
            label="Match a specific pattern"
            description="Only accepts values that match a specific regular expression"
            value={meta?.regex}
            onChange={(v) => setMeta({ field: 'regex', value: v })}
          />

          <styled.div style={{ display: 'flex', gap: 16 }}>
            <Input
              type="select"
              label="Content Media Types"
              value={meta?.contentMediaType}
              options={contentMediaTypes}
              onChange={(v) => setMeta({ field: 'contentMediaType', value: v })}
            />
            {!CONTENTMEDIATYPES.includes(meta?.contentMediaType) && (
              <Input
                type="text"
                label="Custom ContentMediaType"
                value={meta?.contentMediaType}
                onChange={(v) =>
                  setMeta({ field: 'contentMediaType', value: v })
                }
              />
            )}
          </styled.div>

          <Input
            type="select"
            label="Content Media Encoding"
            value={meta?.contentMediaEncoding}
            options={contentMediaEncodings}
            onChange={(v) =>
              setMeta({ field: 'contentMediaEncoding', value: v })
            }
          />

          <styled.div
            style={{
              flexDirection: 'column',
              display: 'flex',
              gap: 16,
              marginTop: 16,
              maxWidth: 128,
            }}
          >
            <Input
              type="checkbox"
              title="Multiline"
              // description="Ensures that multiple entries can't have the same value"
              value={meta?.multiline}
              onChange={(v) => setMeta({ field: 'multiline', value: v })}
            />
            <Input
              type="checkbox"
              title="Display"
              // description="Ensures that multiple entries can't have the same value"
              value={meta?.display}
              onChange={(v) => setMeta({ field: 'display', value: v })}
            />
          </styled.div>
        </>
      ) : fieldType === 'text' ? (
        <></>
      ) : fieldType === 'number' ? (
        // NUMBER
        <>
          <styled.div style={{ display: 'flex', gap: 16 }}>
            <Input
              type="number"
              label="Minimum"
              value={meta?.minimum}
              onChange={(v) => setMeta({ field: 'minimum', value: v })}
            />
            <Input
              type="number"
              label="Maximum"
              value={meta?.maximum}
              onChange={(v) => setMeta({ field: 'maximum', value: v })}
            />
            <Input
              type="number"
              label="Multiple Of"
              value={meta?.multipleOf}
              onChange={(v) => setMeta({ field: 'multipleOf', value: v })}
            />
          </styled.div>
          <styled.div style={{ display: 'flex', marginTop: 16 }}>
            <Input
              type="checkbox"
              title="Exclusive Maximum"
              value={meta?.exclusiveMaximum}
              onChange={(v) => setMeta({ field: 'exclusiveMaximum', value: v })}
            />
            <Input
              type="checkbox"
              title="Exclusive Minimum"
              value={meta?.exclusiveMinimum}
              onChange={(v) => setMeta({ field: 'exclusiveMinimum', value: v })}
            />
          </styled.div>
        </>
      ) : (
        '🙈'
      )}
    </div>
  )
}

const stringFormatOptions = [
  { value: 'email' },
  { value: 'URL' },
  { value: 'MACAddress' },
  { value: 'IP' },
  { value: 'IPRange' },
  { value: 'FQDN' },
  { value: 'IBAN' },
  { value: 'BIC' },
  { value: 'alpha' },
  { value: 'alphaLocales' },
  { value: 'alphanumeric' },
  { value: 'alphanumericLocales' },
  { value: 'passportNumber' },
  { value: 'port' },
  { value: 'lowercase' },
  { value: 'uppercase' },
  { value: 'ascii' },
  { value: 'semVer' },
  { value: 'surrogatePair' },
  { value: 'IMEI' },
  { value: 'hexadecimal' },
  { value: 'octal' },
  { value: 'hexColor' },
  { value: 'rgbColor' },
  { value: 'HSL' },
  { value: 'ISRC' },
  { value: 'MD5' },
  { value: 'JWT' },
  { value: 'UUID' },
  { value: 'luhnNumber' },
  { value: 'creditCard' },
  { value: 'identityCard' },
  { value: 'EAN' },
  { value: 'ISIN' },
  { value: 'ISBN' },
  { value: 'ISSN' },
  { value: 'mobilePhone' },
  { value: 'mobilePhoneLocales' },
  { value: 'postalCode' },
  { value: 'postalCodeLocales' },
  { value: 'ethereumAddress' },
  { value: 'currency' },
  { value: 'btcAddress' },
  { value: 'ISO6391' },
  { value: 'ISO8601' },
  { value: 'RFC3339' },
  { value: 'ISO31661Alpha2' },
  { value: 'ISO31661Alpha3' },
  { value: 'ISO4217' },
  { value: 'base32' },
  { value: 'base58' },
  { value: 'base64' },
  { value: 'dataURI' },
  { value: 'magnetURI' },
  { value: 'mimeType' },
  { value: 'latLong' },
  { value: 'slug' },
  { value: 'strongPassword' },
  { value: 'taxID' },
  { value: 'licensePlate' },
  { value: 'VAT' },
]

const contentMediaTypes = [
  { value: 'text/html' },
  { value: 'text/plain' },
  { value: 'text/markdown' },
  { value: 'image/png' },
  { value: 'image/jpeg' },
  { value: 'video/mp4' },
  { value: 'image/*' },
  { value: 'video/*' },
  { value: 'audio/*' },
  { value: '*/*' },
  { value: 'string/string' },
]

const CONTENTMEDIATYPES = [
  'text/html',
  'text/plain',
  'text/markdown',
  'image/png',
  'image/jpeg',
  'video/mp4',
  'image/*',
  'video/*',
  'audio/*',
  '*/*',
]

const contentMediaEncodings = [
  { value: '7bit' },
  { value: '8bit' },
  { value: 'binary' },
  { value: 'quoted-printable' },
  { value: 'base16' },
  { value: 'base32' },
  { value: 'base64' },
]
