import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import logo from '../src/app/assets/based.svg'
import { Logo } from '../src/app/components/logo'

describe('Logo Component', () => {
  it('renders correctly with the correct image source and alt text', () => {
    render(<Logo />)

    const imgElement = screen.getByRole('img', { name: 'Based.io' })
    expect(imgElement).toBeInTheDocument()
    expect(imgElement).toHaveAttribute('src', logo)
    expect(imgElement).toHaveAttribute('alt', 'Based.io')
  })
})
