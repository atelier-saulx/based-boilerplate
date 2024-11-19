import type { BasedClient } from '@based/client'
import { useClient } from '@based/react'
import { fireEvent, render, screen } from '@testing-library/react'
import {
  type MockedFunction,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import { Greetings } from '../src/app/components/greetings'

vi.mock('@based/react', () => ({
  useClient: vi.fn(),
}))

describe('Greetings Component', () => {
  let mockCall: MockedFunction<BasedClient['call']>
  let mockedUseClient: MockedFunction<typeof useClient>

  beforeAll(() => {
    mockedUseClient = useClient as MockedFunction<typeof useClient>
  })

  beforeEach(() => {
    mockCall = vi.fn()
    mockedUseClient.mockReturnValue({
      call: mockCall,
    } as Partial<BasedClient> as BasedClient)
  })

  it('should call handleChange when input changes', async () => {
    mockCall.mockResolvedValue('Hello, Test!')

    render(<Greetings />)

    const input = screen.getByPlaceholderText(
      'Whats your name?',
    ) as HTMLInputElement
    fireEvent.change(input, { target: { value: 'Test' } })

    expect(mockCall).toHaveBeenCalledWith('hello', 'Test')

    const resultText = await screen.findByText('Hello, Test!')
    expect(resultText).toBeInTheDocument()
  })

  it('should initialize with a default value', async () => {
    mockCall.mockResolvedValue('😊')

    render(<Greetings />)

    expect(mockCall).toHaveBeenCalledWith('hello', '')

    const resultText = await screen.findByText('😊')
    expect(resultText).toBeInTheDocument()
  })
})
