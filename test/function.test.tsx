import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FunctionModule } from '../src/app/components/function'

describe('FunctionModule Component', () => {
  const renderComponent = (name: string, children: React.ReactNode) => {
    return render(<FunctionModule name={name}>{children}</FunctionModule>)
  }

  it('renders the component with a valid name prop and children', () => {
    const name = 'Test Module'
    const childrenText = 'This is a child element'

    renderComponent(name, <p>{childrenText}</p>)

    const nameElement = screen.getByText(name)
    expect(nameElement).toBeInTheDocument()

    const childrenElement = screen.getByText(childrenText)
    expect(childrenElement).toBeInTheDocument()
  })
})
