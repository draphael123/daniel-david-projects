'use client'

import { useState } from 'react'

interface Column {
  id: string
  name: string
  type: string
}

interface SearchAndFilterProps {
  columns: Column[]
  searchQuery: string
  onSearchChange: (query: string) => void
  filter: any
  onFilterChange: (filter: any) => void
}

export function SearchAndFilter({
  columns,
  searchQuery,
  onSearchChange,
  filter,
  onFilterChange,
}: SearchAndFilterProps) {
  const [showFilter, setShowFilter] = useState(false)
  const [filterColumn, setFilterColumn] = useState('')
  const [filterOperator, setFilterOperator] = useState('equals')
  const [filterValue, setFilterValue] = useState('')

  const applyFilter = () => {
    if (!filterColumn) {
      onFilterChange(null)
      setShowFilter(false)
      return
    }

    onFilterChange({
      columnId: filterColumn,
      operator: filterOperator,
      value: filterValue,
    })
    setShowFilter(false)
  }

  const clearFilter = () => {
    onFilterChange(null)
    setFilterColumn('')
    setFilterOperator('equals')
    setFilterValue('')
    setShowFilter(false)
  }

  const selectedColumn = columns.find(c => c.id === filterColumn)
  const showValueInput = filterOperator !== 'is_empty'

  return (
    <div className="mb-4 flex flex-col md:flex-row gap-4">
      {/* Search */}
      <div className="flex-1">
        <div className="relative">
          <input
            type="text"
            placeholder="🔍 Search across all columns..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Filter */}
      <div className="relative">
        <button
          onClick={() => setShowFilter(!showFilter)}
          className={`px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors ${
            filter ? 'bg-purple-100 border-purple-300' : 'border-gray-300'
          }`}
        >
          🎯 Filter {filter && '●'}
        </button>

        {showFilter && (
          <div className="absolute top-full right-0 mt-2 bg-white border rounded-lg shadow-lg p-4 z-50 min-w-[300px]">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold mb-1">Column</label>
                <select
                  value={filterColumn}
                  onChange={(e) => setFilterColumn(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="">Select column...</option>
                  {columns.map((col) => (
                    <option key={col.id} value={col.id}>
                      {col.name}
                    </option>
                  ))}
                </select>
              </div>

              {filterColumn && (
                <>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Operator</label>
                    <select
                      value={filterOperator}
                      onChange={(e) => setFilterOperator(e.target.value)}
                      className="w-full px-3 py-2 border rounded"
                    >
                      {selectedColumn?.type === 'text' && (
                        <>
                          <option value="equals">Equals</option>
                          <option value="contains">Contains</option>
                          <option value="is_empty">Is Empty</option>
                        </>
                      )}
                      {selectedColumn?.type === 'number' && (
                        <>
                          <option value="equals">Equals</option>
                          <option value="greater_than">Greater Than</option>
                          <option value="less_than">Less Than</option>
                          <option value="is_empty">Is Empty</option>
                        </>
                      )}
                      {(selectedColumn?.type === 'select' || selectedColumn?.type === 'multi_select') && (
                        <>
                          <option value="equals">Equals</option>
                          <option value="is_empty">Is Empty</option>
                        </>
                      )}
                      {selectedColumn?.type === 'checkbox' && (
                        <>
                          <option value="equals">Is True</option>
                          <option value="is_empty">Is False/Empty</option>
                        </>
                      )}
                      {selectedColumn?.type === 'date' && (
                        <>
                          <option value="equals">Equals</option>
                          <option value="greater_than">After</option>
                          <option value="less_than">Before</option>
                          <option value="is_empty">Is Empty</option>
                        </>
                      )}
                    </select>
                  </div>

                  {showValueInput && (
                    <div>
                      <label className="block text-sm font-semibold mb-1">Value</label>
                      {selectedColumn?.type === 'checkbox' ? (
                        <select
                          value={filterValue}
                          onChange={(e) => setFilterValue(e.target.value)}
                          className="w-full px-3 py-2 border rounded"
                        >
                          <option value="true">True</option>
                          <option value="false">False</option>
                        </select>
                      ) : selectedColumn?.type === 'date' ? (
                        <input
                          type="date"
                          value={filterValue}
                          onChange={(e) => setFilterValue(e.target.value)}
                          className="w-full px-3 py-2 border rounded"
                        />
                      ) : selectedColumn?.type === 'number' ? (
                        <input
                          type="number"
                          value={filterValue}
                          onChange={(e) => setFilterValue(e.target.value)}
                          className="w-full px-3 py-2 border rounded"
                        />
                      ) : (
                        <input
                          type="text"
                          value={filterValue}
                          onChange={(e) => setFilterValue(e.target.value)}
                          className="w-full px-3 py-2 border rounded"
                          placeholder="Enter value..."
                        />
                      )}
                    </div>
                  )}
                </>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  onClick={applyFilter}
                  className="flex-1 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
                >
                  Apply
                </button>
                {filter && (
                  <button
                    onClick={clearFilter}
                    className="px-4 py-2 border rounded hover:bg-gray-50 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

