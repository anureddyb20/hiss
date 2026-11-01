import { render, screen } from '@testing-library/react'
import { KpiCard } from './KpiCard'

describe('KpiCard', () => {
  it('renders the title and number', () => {
    render(<KpiCard title="Total Cases" number={42} trend={0.12} />)
    expect(screen.getByText('Total Cases')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
  })
})