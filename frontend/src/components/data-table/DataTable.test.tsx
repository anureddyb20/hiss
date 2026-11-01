import { render, screen } from '@testing-library/react'
import { DataTable } from './DataTable'

describe('DataTable', () => {
  it('renders header and rows', () => {
    const headers = ['Case #', 'Institution', 'Subject']
    const rows = [
      ['CASE-001', 'Institute A', 'Eligibility issue']
    ]
    render(
      <DataTable
        columns={headers}
        data={rows}
        initialPage={1}
        pageSize={10}
      />
    )
    expect(screen.getByText('CASE-001')).toBeInTheDocument()
  })
})