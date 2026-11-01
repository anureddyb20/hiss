import React from 'react'

interface DataTableProps {
  columns: string[]
  data: string[][]
  initialPage?: number
  pageSize?: number
}

export const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  initialPage = 1,
  pageSize = 10,
}) => {
  const pages = Math.ceil(data.length / (pageSize ?? 1))
  const page = Math.max(1, Math.min(initialPage, pages))
  const start = (page - 1) * (pageSize ?? 1)
  const end = start + (pageSize ?? 1)
  const pageData = data.slice(start, end)

  return (
    <div className="overflow-x-auto">
      <table className="w-full rounded-md border border-gray-200">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col} className="p-3 border border-gray-200 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pageData.map((row, i) => (
            <tr key={i} className="bg-white border-b border-gray-200">
              {row.map((cell, j) => (
                <td key={j} className="p-3 border-b border-gray-200 text-sm text-gray-700">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}