import React from 'react'
import { styled } from 'inlines'
import { Input } from '@based/ui'
import { MultiSelect } from '@based/ui/dist/components/Input/MultiSelect'

// TODO: ???

// string
// text -> check language
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
    // STRING & // TEXT
    <div style={{ display: 'grid', gap: 12 }}>
      {fieldType === 'string' || fieldType === 'text' ? (
        <>
          {fieldType === 'text' && (
            // @ts-ignore
            <Input
              type="multi-select"
              label="Languages"
              options={languageSelectOptions}
              value={meta?.languages}
              onChange={(v) => setMeta({ field: 'languages', value: v })}
            />
          )}
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
          <Input
            type="select"
            label="String Display Format"
            value={meta?.display}
            options={stringFormatDisplayOptions}
            onChange={(v) => setMeta({ field: 'display', value: v })}
          />
          <styled.div style={{ gap: 16, marginTop: 16, maxWidth: 128 }}>
            <Input
              type="checkbox"
              title="Multiline"
              value={meta?.multiline}
              onChange={(v) => setMeta({ field: 'multiline', value: v })}
            />
          </styled.div>
        </>
      ) : fieldType === 'number' ||
        fieldType === 'int' ||
        fieldType === 'timestamp' ? (
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
          <styled.div
            style={{ display: 'flex', marginTop: 16, marginBottom: 16 }}
          >
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
          {(fieldType === 'number' || fieldType === 'int') && (
            <Input
              type="select"
              label="Display Format"
              value={meta?.display}
              options={numberDisplayFormatOptions}
              onChange={(v) => setMeta({ field: 'display', value: v })}
            />
          )}
          {fieldType === 'timestamp' && (
            <Input
              type="select"
              label="Display Date Format"
              value={meta?.display}
              options={dateFormatOptions}
              onChange={(v) => setMeta({ field: 'display', value: v })}
            />
          )}
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

const stringFormatDisplayOptions = [
  { value: 'lowercase' },
  { value: 'uppercase' },
  { value: 'capitalize' },
]

const numberDisplayFormatOptions = [
  { value: 'short' },
  { value: 'human' },
  { value: 'ratio' },
  { value: 'bytes' },
  { value: 'euro' },
  { value: 'dollar' },
  { value: 'pound' },
  { value: 'round-${number}' },
]

const languageSelectOptions = [
  { value: 'ab', label: 'Abkhazian' },
  { value: 'aa', label: 'Afar' },
  { value: 'af', label: 'Afrikaans' },
  { value: 'ak', label: 'Akan' },
  { value: 'sq', label: 'Albanian' },
  { value: 'am', label: 'Amharic' },
  { value: 'ar', label: 'Arabic' },
  { value: 'an', label: 'Aragonese' },
  { value: 'hy', label: 'Armenian' },
  { value: 'as', label: 'Assamese' },
  { value: 'av', label: 'Avaric' },
  { value: 'ae', label: 'Avestan' },
  { value: 'ay', label: 'Aymara' },
  { value: 'az', label: 'Azerbaijani' },
  { value: 'bm', label: 'Bambara' },
  { value: 'ba', label: 'Bashkir' },
  { value: 'eu', label: 'Basque' },
  { value: 'be', label: 'Belarusian' },
  { value: 'bn', label: 'Bengali' },
  { value: 'bh', label: 'Bihari languages' },
  { value: 'bi', label: 'Bislama' },
  { value: 'bs', label: 'Bosnian' },
  { value: 'br', label: 'Breton' },
  { value: 'bg', label: 'Bulgarian' },
  { value: 'my', label: 'Burmese' },
  { value: 'ca', label: 'Catalan, Valencian' },
  { value: 'km', label: 'Central Khmer' },
  { value: 'ch', label: 'Chamorro' },
  { value: 'ce', label: 'Chechen' },
  { value: 'ny', label: 'Chichewa, Chewa, Nyanja' },
  { value: 'zh', label: 'Chinese' },
  { value: 'cu', label: 'Church Slavonic, Old Bulgarian, Old Church Slavonic' },
  { value: 'cv', label: 'Chuvash' },
  { value: 'kw', label: 'Cornish' },
  { value: 'co', label: 'Corsican' },
  { value: 'cr', label: 'Cree' },
  { value: 'hr', label: 'Croatian' },
  { value: 'cs', label: 'Czech' },
  { value: 'da', label: 'Danish' },
  { value: 'dv', label: 'Divehi, Dhivehi, Maldivian' },
  { value: 'nl', label: 'Dutch, Flemish' },
  { value: 'dz', label: 'Dzongkha' },
  { value: 'en', label: 'English' },
  { value: 'eo', label: 'Esperanto' },
  { value: 'et', label: 'Estonian' },
  { value: 'ee', label: 'Ewe' },
  { value: 'fo', label: 'Faroese' },
  { value: 'fj', label: 'Fijian' },
  { value: 'fi', label: 'Finnish' },
  { value: 'fr', label: 'French' },
  { value: 'ff', label: 'Fulah' },
  { value: 'gd', label: 'Gaelic, Scottish Gaelic' },
  { value: 'gl', label: 'Galician' },
  { value: 'lg', label: 'Ganda' },
  { value: 'ka', label: 'Georgian' },
  { value: 'de', label: 'German' },
  { value: 'ki', label: 'Gikuyu, Kikuyu' },
  { value: 'el', label: 'Greek (Modern)' },
  { value: 'kl', label: 'Greenlandic, Kalaallisut' },
  { value: 'gn', label: 'Guarani' },
  { value: 'gu', label: 'Gujarati' },
  { value: 'ht', label: 'Haitian, Haitian Creole' },
  { value: 'ha', label: 'Hausa' },
  { value: 'he', label: 'Hebrew' },
  { value: 'hz', label: 'Herero' },
  { value: 'hi', label: 'Hindi' },
  { value: 'ho', label: 'Hiri Motu' },
  { value: 'hu', label: 'Hungarian' },
  { value: 'is', label: 'Icelandic' },
  { value: 'io', label: 'Ido' },
  { value: 'ig', label: 'Igbo' },
  { value: 'id', label: 'Indonesian' },
  {
    value: 'ia',
    label: 'Interlingua (International Auxiliary Language Association)',
  },
  { value: 'ie', label: 'Interlingue' },
  { value: 'iu', label: 'Inuktitut' },
  { value: 'ik', label: 'Inupiaq' },
  { value: 'ga', label: 'Irish' },
  { value: 'it', label: 'Italian' },
  { value: 'ja', label: 'Japanese' },
  { value: 'jv', label: 'Javanese' },
  { value: 'kn', label: 'Kannada' },
  { value: 'kr', label: 'Kanuri' },
  { value: 'ks', label: 'Kashmiri' },
  { value: 'kk', label: 'Kazakh' },
  { value: 'rw', label: 'Kinyarwanda' },
  { value: 'kv', label: 'Komi' },
  { value: 'kg', label: 'Kongo' },
  { value: 'ko', label: 'Korean' },
  { value: 'kj', label: 'Kwanyama, Kuanyama' },
  { value: 'ku', label: 'Kurdish' },
  { value: 'ky', label: 'Kyrgyz' },
  { value: 'lo', label: 'Lao' },
  { value: 'la', label: 'Latin' },
  { value: 'lv', label: 'Latvian' },
  { value: 'lb', label: 'Letzeburgesch, Luxembourgish' },
  { value: 'li', label: 'Limburgish, Limburgan, Limburger' },
  { value: 'ln', label: 'Lingala' },
  { value: 'lt', label: 'Lithuanian' },
  { value: 'lu', label: 'Luba-Katanga' },
  { value: 'mk', label: 'Macedonian' },
  { value: 'mg', label: 'Malagasy' },
  { value: 'ms', label: 'Malay' },
  { value: 'ml', label: 'Malayalam' },
  { value: 'mt', label: 'Maltese' },
  { value: 'gv', label: 'Manx' },
  { value: 'mi', label: 'Maori' },
  { value: 'mr', label: 'Marathi' },
  { value: 'mh', label: 'Marshallese' },
  { value: 'ro', label: 'Moldovan, Moldavian, Romanian' },
  { value: 'mn', label: 'Mongolian' },
  { value: 'na', label: 'Nauru' },
  { value: 'nv', label: 'Navajo, Navaho' },
  { value: 'nd', label: 'Northern Ndebele' },
  { value: 'ng', label: 'Ndonga' },
  { value: 'ne', label: 'Nepali' },
  { value: 'se', label: 'Northern Sami' },
  { value: 'no', label: 'Norwegian' },
  { value: 'nb', label: 'Norwegian Bokmål' },
  { value: 'nn', label: 'Norwegian Nynorsk' },
  { value: 'ii', label: 'Nuosu, Sichuan Yi' },
  { value: 'oc', label: 'Occitan (post 1500)' },
  { value: 'oj', label: 'Ojibwa' },
  { value: 'or', label: 'Oriya' },
  { value: 'om', label: 'Oromo' },
  { value: 'os', label: 'Ossetian, Ossetic' },
  { value: 'pi', label: 'Pali' },
  { value: 'pa', label: 'Panjabi, Punjabi' },
  { value: 'ps', label: 'Pashto, Pushto' },
  { value: 'fa', label: 'Persian' },
  { value: 'pl', label: 'Polish' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'qu', label: 'Quechua' },
  { value: 'rm', label: 'Romansh' },
  { value: 'rn', label: 'Rundi' },
  { value: 'ru', label: 'Russian' },
  { value: 'sm', label: 'Samoan' },
  { value: 'sg', label: 'Sango' },
  { value: 'sa', label: 'Sanskrit' },
  { value: 'sc', label: 'Sardinian' },
  { value: 'sr', label: 'Serbian' },
  { value: 'sn', label: 'Shona' },
  { value: 'sd', label: 'Sindhi' },
  { value: 'si', label: 'Sinhala, Sinhalese' },
  { value: 'sk', label: 'Slovak' },
  { value: 'sl', label: 'Slovenian' },
  { value: 'so', label: 'Somali' },
  { value: 'st', label: 'Sotho, Southern' },
  { value: 'nr', label: 'South Ndebele' },
  { value: 'es', label: 'Spanish, Castilian' },
  { value: 'su', label: 'Sundanese' },
  { value: 'sw', label: 'Swahili' },
  { value: 'ss', label: 'Swati' },
  { value: 'sv', label: 'Swedish' },
  { value: 'tl', label: 'Tagalog' },
  { value: 'ty', label: 'Tahitian' },
  { value: 'tg', label: 'Tajik' },
  { value: 'ta', label: 'Tamil' },
  { value: 'tt', label: 'Tatar' },
  { value: 'te', label: 'Telugu' },
  { value: 'th', label: 'Thai' },
  { value: 'bo', label: 'Tibetan' },
  { value: 'ti', label: 'Tigrinya' },
  { value: 'to', label: 'Tonga (Tonga Islands)' },
  { value: 'ts', label: 'Tsonga' },
  { value: 'tn', label: 'Tswana' },
  { value: 'tr', label: 'Turkish' },
  { value: 'tk', label: 'Turkmen' },
  { value: 'tw', label: 'Twi' },
  { value: 'ug', label: 'Uighur, Uyghur' },
  { value: 'uk', label: 'Ukrainian' },
  { value: 'ur', label: 'Urdu' },
  { value: 'uz', label: 'Uzbek' },
  { value: 've', label: 'Venda' },
  { value: 'vi', label: 'Vietnamese' },
  { value: 'vo', label: 'Volap_k' },
  { value: 'wa', label: 'Walloon' },
  { value: 'cy', label: 'Welsh' },
  { value: 'fy', label: 'Western Frisian' },
  { value: 'wo', label: 'Wolof' },
  { value: 'xh', label: 'Xhosa' },
  { value: 'yi', label: 'Yiddish' },
  { value: 'yo', label: 'Yoruba' },
  { value: 'za', label: 'Zhuang, Chuang' },
  { value: 'zu', label: 'Zulu' },
]

const dateFormatOptions = [
  { value: 'date' },
  { value: 'date-time' },
  { value: 'date-time-text' },
  { value: 'human' },
  { value: 'time' },
  { value: 'time-precise' },
]
