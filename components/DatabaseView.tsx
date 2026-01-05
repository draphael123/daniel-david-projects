'use client'

import { useEffect, useState } from 'react'
import { getColumns } from '@/app/actions/columns'
import { getRows } from '@/app/actions/rows'
import { DatabaseTable } from './DatabaseTable'
import { SearchAndFilter } from './SearchAndFilter'
import { Footer } from './Footer'

interface Column {
  id: string
  name: string
  type: string
  orderIndex: number
  settingsJson: any
}

interface Row {
  id: string
  orderIndex: number
  cells: Array<{
    id: string
    rowId: string
    columnId: string
    valueJson: string | null
    column: Column
  }>
}

export function DatabaseView({ dbConnected }: { dbConnected: boolean }) {
  const [columns, setColumns] = useState<Column[]>([])
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<any>(null)

  const loadData = async () => {
    setLoading(true)
    try {
      const [colsRes, rowsRes] = await Promise.all([
        getColumns(),
        getRows(),
      ])

      if (colsRes.success) setColumns(colsRes.data)
      if (rowsRes.success) setRows(rowsRes.data)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Filter rows based on search and filter
  const filteredRows = rows.filter((row) => {
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase()
      const matches = row.cells.some((cell) => {
        if (!cell.valueJson) return false
        const value = JSON.parse(cell.valueJson)
        const str = Array.isArray(value) 
          ? value.join(' ').toLowerCase()
          : String(value).toLowerCase()
        return str.includes(searchLower)
      })
      if (!matches) return false
    }

    if (filter) {
      const cell = row.cells.find((c) => c.columnId === filter.columnId)
      if (!cell || !cell.valueJson) {
        if (filter.operator !== 'is_empty') return false
      } else {
        const value = JSON.parse(cell.valueJson)
        switch (filter.operator) {
          case 'equals':
            return String(value) === filter.value
          case 'contains':
            return String(value).toLowerCase().includes(filter.value.toLowerCase())
          case 'greater_than':
            return Number(value) > Number(filter.value)
          case 'less_than':
            return Number(value) < Number(filter.value)
          default:
            return true
        }
      }
    }

    return true
  })

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white py-8 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 flex items-center gap-3">
            David + Daniel Shared Database{' '}
            <span className="text-3xl">✨📚🧠</span>
          </h1>
          <div className="flex items-center gap-4 mt-4">
            {dbConnected ? (
              <span className="text-sm bg-green-500/20 px-3 py-1 rounded-full">
                DB connected ✅
              </span>
            ) : (
              <span className="text-sm bg-red-500/20 px-3 py-1 rounded-full">
                DB disconnected ⚠️
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <SearchAndFilter
          columns={columns}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filter={filter}
          onFilterChange={setFilter}
        />

        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="animate-spin text-4xl mb-4">🌱</div>
            <p className="text-gray-600">Loading your database...</p>
          </div>
        ) : (
          <DatabaseTable
            columns={columns}
            rows={filteredRows}
            onDataChange={loadData}
          />
        )}
      </div>

      <Footer />
    </div>
  )
}

