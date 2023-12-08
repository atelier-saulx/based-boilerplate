import React, { useState } from 'react'
import { styled } from 'inlines'
import { Text, Button, color, Row } from '@based/ui'
import { useRoute } from 'kabouter'

export const StarterWidget = () => {
  const [step, setStep] = useState(1)

  return (
    <styled.div
      style={{
        padding: '12px 24px',
        borderRadius: 8,
        border: `1px solid ${color('inputBorder', 'neutralNormal', 'default')}`,
        marginBottom: 24,
      }}
    >
      <Text size={18} weight="strong" style={{ marginBottom: 16 }}>
        Start building your project
      </Text>
      <Row style={{ alignItems: 'baseline' }}>
        <styled.div style={{ width: '50%', paddingRight: 24 }}>
          <Step
            text="Set up your schema"
            number={1}
            setStep={setStep}
            step={step}
          />
          <Step
            text="Add content to your types"
            number={2}
            setStep={setStep}
            step={step}
          />
          <Step
            text="Deploy your functions"
            number={3}
            setStep={setStep}
            step={step}
          />
          <Step
            text="Integrate you content with your front-end"
            number={4}
            setStep={setStep}
            step={step}
          />
        </styled.div>
        <styled.div style={{ width: '50%' }}>
          <InfoBlock step={step} />
        </styled.div>
      </Row>
    </styled.div>
  )
}

const InfoBlock = ({ step }) => {
  const route = useRoute('[section]')

  return (
    <styled.div
      style={{
        width: '100%',
        padding: '12px 24px',
        borderRadius: 8,
        border: `1px solid ${color('inputBorder', 'neutralNormal', 'default')}`,
      }}
    >
      {step === 1 && (
        <styled.div>
          <Text weight="strong">Setting up your schema</Text>
          <Text light>Define the building blocks of your data</Text>
          <Button
            onClick={() =>
              route.setQuery({
                section: 'schema-builder',
              })
            }
            style={{ marginTop: 16 }}
            size="small"
          >
            Add a Schema Type
          </Button>
        </styled.div>
      )}
    </styled.div>
  )
}

const Step = ({ text, number, setStep, step }) => {
  return (
    <styled.div
      onClick={() => setStep(number)}
      style={{
        borderRadius: 8,
        cursor: 'pointer',
        height: 48,
        padding: '0px 16px',
        backgroundColor:
          step === number
            ? color('background', 'brand', 'muted')
            : 'transparent',
        display: 'flex',
        alignItems: 'center',
        marginBottom: 8,
        '&:hover': {
          backgroundColor: color('background', 'brand', 'subtle'),
        },
      }}
    >
      <Row>
        <styled.div
          style={{
            borderRadius: '50%',
            marginRight: 16,
            width: 26,
            height: 26,
            backgroundColor: color('background', 'default', 'subtle'),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text color="brand" weight="strong">
            {number}
          </Text>
        </styled.div>
        <Text weight="medium">{text}</Text>
      </Row>
    </styled.div>
  )
}
