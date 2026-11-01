import { render, screen } from '@testing-library/react'
import { StatusBadge } from './StatusBadge'

describe('StatusBadge', () => {
  it('renders a green "open" badge', () => {
    render(<StatusBadge status="open" />)
    expect(screen.getByText('open')).toHaveClass('bg-green-100')
  })
  it('renders a gray "closed" badge', () => {
    render(<StatusBadge status="closed" />)
    expect(screen.getByText('closed')).toHaveClass('bg-gray-100')
  })
})