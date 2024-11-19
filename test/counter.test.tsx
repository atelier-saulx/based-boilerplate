import { useQuery } from '@based/react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Counter } from '../src/app/components/counter'

vi.mock('@based/react', () => ({
  useQuery: vi.fn(),
}))

describe('Counter Component', () => {
  it('mocks useQuery and renders the mocked counter value', () => {
    const mockUseQuery = useQuery as ReturnType<typeof vi.fn>
    const mockCounterValue = 42

    mockUseQuery.mockReturnValue({
      data: mockCounterValue,
      loading: false,
    })

    render(<Counter />)

    expect(mockUseQuery).toHaveBeenCalledWith('counter')
    expect(mockUseQuery).toHaveBeenCalledTimes(1)

    const counterElement = screen.getByText(mockCounterValue.toString())
    expect(counterElement).toBeInTheDocument()
  })
})
