'use client'

import { useState, useRef, useEffect } from 'react'
import { createRow, deleteRow, duplicateRow } from '@/app/actions/rows'
import { updateCell } from '@/app/actions/cells'
import { createColumn, updateColumn, deleteColumn, reorderColumns } from '@/app/actions/columns'
import toast from 'react-hot-toast'
import confetti from 'canvas-confetti'
import { ColumnMenu } from './ColumnMenu'
import { RowMenu } from './RowMenu'
import { CellEditor } from './CellEditor'

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

interface DatabaseTableProps {
  columns: Column[]
  rows: Row[]
  onDataChange: () => void
}

export function DatabaseTable({ columns, rows, onDataChange }: DatabaseTableProps) {
  const [editingCell, setEditingCell] = useState<{ rowId: string; columnId: string } | null>(null)
  const [showAddColumn, setShowAddColumn] = useState(false)
  const [newColumnName, setNewColumnName] = useState('')
  const [newColumnType, setNewColumnType] = useState('text')
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleAddRow = async () => {
    const result = await createRow()
    if (result.success) {
      toast.success('Row added! ➕')
      onDataChange()
    } else {
      toast.error(result.error || 'Failed to add row')
    }
  }

  const handleDeleteRow = async (rowId: string) => {
    if (!confirm('Delete this row? 🗑️')) return
    
    const result = await deleteRow(rowId)
    if (result.success) {
      toast.success('Row deleted! 🗑️')
      onDataChange()
    } else {
      toast.error(result.error || 'Failed to delete row')
    }
  }

  const handleDuplicateRow = async (rowId: string) => {
    const result = await duplicateRow(rowId)
    if (result.success) {
      toast.success('Row duplicated! 🪄')
      onDataChange()
    } else {
      toast.error(result.error || 'Failed to duplicate row')
    }
  }

  const handleCellUpdate = async (rowId: string, columnId: string, value: string) => {
    const result = await updateCell(rowId, columnId, value)
    if (result.success) {
      onDataChange()
    } else {
      toast.error(result.error || 'Failed to update cell')
    }
  }

  const handleAddColumn = async () => {
    if (!newColumnName.trim()) {
      toast.error('Column name is required')
      return
    }

    const maxOrder = columns.length > 0 
      ? Math.max(...columns.map(c => c.orderIndex)) + 1 
      : 0

    const formData = new FormData()
    formData.append('name', newColumnName)
    formData.append('type', newColumnType)
    formData.append('orderIndex', maxOrder.toString())

    const result = await createColumn(formData)
    if (result.success) {
      toast.success(`Column "${newColumnName}" added! 🎉`)
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      })
      setNewColumnName('')
      setNewColumnType('text')
      setShowAddColumn(false)
      onDataChange()
    } else {
      toast.error(result.error || 'Failed to add column')
    }
  }

  const handleColumnDragStart = (columnId: string) => {
    setDraggedColumn(columnId)
  }

  const handleColumnDrop = async (targetColumnId: string) => {
    if (!draggedColumn || draggedColumn === targetColumnId) {
      setDraggedColumn(null)
      return
    }

    const draggedIndex = columns.findIndex(c => c.id === draggedColumn)
    const targetIndex = columns.findIndex(c => c.id === targetColumnId)

    if (draggedIndex === -1 || targetIndex === -1) return

    const newColumns = [...columns]
    const [removed] = newColumns.splice(draggedIndex, 1)
    newColumns.splice(targetIndex, 0, removed)

    const columnIds = newColumns.map(c => c.id)
    const result = await reorderColumns(columnIds)

    if (result.success) {
      toast.success('Columns reordered! 🔄')
      onDataChange()
    } else {
      toast.error(result.error || 'Failed to reorder columns')
    }

    setDraggedColumn(null)
  }

  const getCellValue = (row: Row, columnId: string) => {
    const cell = row.cells.find(c => c.columnId === columnId)
    if (!cell || !cell.valueJson) return null
    try {
      const parsed = JSON.parse(cell.valueJson)
      return parsed
    } catch (error) {
      console.error('Failed to parse cell value:', cell.valueJson, error)
      return null
    }
  }

  // Mobile view: card layout
  const mobileView = (
    <div className="space-y-4 md:hidden">
        {rows.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-6xl mb-4">🌱</div>
            <p className="text-gray-600 mb-4">No rows yet. Add your first row!</p>
            <button
              onClick={handleAddRow}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg"
            >
              ➕ Add Row
            </button>
          </div>
        ) : (
          rows.map((row) => (
            <div key={row.id} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-lg">
                  {getCellValue(row, columns[0]?.id) || 'Untitled'}
                </h3>
                <RowMenu
                  rowId={row.id}
                  onDelete={() => handleDeleteRow(row.id)}
                  onDuplicate={() => handleDuplicateRow(row.id)}
                />
              </div>
              <div className="space-y-2">
                {columns.slice(1).map((column) => (
                  <div key={column.id} className="border-b border-gray-100 pb-2">
                    <label className="text-xs text-gray-500 uppercase font-semibold">
                      {column.name}
                    </label>
                    <CellEditor
                      column={column}
                      value={getCellValue(row, column.id)}
                      isEditing={editingCell?.rowId === row.id && editingCell?.columnId === column.id}
                      onStartEdit={() => setEditingCell({ rowId: row.id, columnId: column.id })}
                      onCancelEdit={() => setEditingCell(null)}
                      onSave={(value) => {
                        handleCellUpdate(row.id, column.id, value)
                        setEditingCell(null)
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
        <button
          onClick={handleAddRow}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
        >
          ➕ Add Row
        </button>
      </div>
    )

  // Desktop view: table layout
  const desktopView = (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hidden md:block">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-purple-50 to-pink-50 border-b-2 border-purple-200">
              <th className="p-3 text-left font-semibold text-gray-700 sticky left-0 bg-gradient-to-r from-purple-50 to-pink-50 z-10 min-w-[100px]">
                <RowMenu rowId="" onAdd={handleAddRow} />
              </th>
              {columns.map((column) => (
                <th
                  key={column.id}
                  className="p-3 text-left font-semibold text-gray-700 min-w-[150px] border-l border-gray-200 relative group cursor-move"
                  draggable
                  onDragStart={() => handleColumnDragStart(column.id)}
                  onDragOver={(e) => {
                    e.preventDefault()
                    e.currentTarget.classList.add('bg-purple-100')
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.classList.remove('bg-purple-100')
                  }}
                  onDrop={(e) => {
                    e.preventDefault()
                    e.currentTarget.classList.remove('bg-purple-100')
                    handleColumnDrop(column.id)
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1">
                      {column.name}
                      {column.type === 'text' && '📝'}
                      {column.type === 'number' && '🔢'}
                      {column.type === 'select' && '📋'}
                      {column.type === 'multi_select' && '🏷️'}
                      {column.type === 'date' && '📅'}
                      {column.type === 'checkbox' && '✅'}
                      {column.type === 'url' && '🔗'}
                    </span>
                    <ColumnMenu
                      column={column}
                      onUpdate={() => onDataChange()}
                      onDelete={() => onDataChange()}
                    />
                  </div>
                </th>
              ))}
              <th className="p-3 min-w-[80px]">
                {showAddColumn ? (
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      placeholder="Column name"
                      value={newColumnName}
                      onChange={(e) => setNewColumnName(e.target.value)}
                      className="px-2 py-1 border rounded text-sm"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddColumn()
                        if (e.key === 'Escape') {
                          setShowAddColumn(false)
                          setNewColumnName('')
                        }
                      }}
                    />
                    <select
                      value={newColumnType}
                      onChange={(e) => setNewColumnType(e.target.value)}
                      className="px-2 py-1 border rounded text-sm"
                    >
                      <option value="text">Text</option>
                      <option value="number">Number</option>
                      <option value="select">Select</option>
                      <option value="multi_select">Multi-select</option>
                      <option value="date">Date</option>
                      <option value="checkbox">Checkbox</option>
                      <option value="url">URL</option>
                    </select>
                    <div className="flex gap-1">
                      <button
                        onClick={handleAddColumn}
                        className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => {
                          setShowAddColumn(false)
                          setNewColumnName('')
                        }}
                        className="text-xs bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAddColumn(true)}
                    className="text-2xl hover:scale-110 transition-transform"
                    title="Add column"
                  >
                    ➕
                  </button>
                )}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 2} className="p-8 text-center text-gray-500">
                  <div className="text-6xl mb-4">🌱</div>
                  <p className="mb-4">No rows yet. Add your first row!</p>
                  <button
                    onClick={handleAddRow}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg"
                  >
                    ➕ Add Row
                  </button>
                </td>
              </tr>
            ) : (
              rows.map((row, rowIndex) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-100 hover:bg-purple-50/30 transition-colors"
                >
                  <td className="p-3 sticky left-0 bg-white z-10 border-r border-gray-200">
                    <RowMenu
                      rowId={row.id}
                      onDelete={() => handleDeleteRow(row.id)}
                      onDuplicate={() => handleDuplicateRow(row.id)}
                    />
                  </td>
                  {columns.map((column) => {
                    const value = getCellValue(row, column.id)
                    const isEditing = editingCell?.rowId === row.id && editingCell?.columnId === column.id
                    return (
                      <td
                        key={column.id}
                        className="p-2 border-l border-gray-100"
                      >
                        <CellEditor
                          column={column}
                          value={value}
                          isEditing={isEditing}
                          onStartEdit={() => setEditingCell({ rowId: row.id, columnId: column.id })}
                          onCancelEdit={() => setEditingCell(null)}
                          onSave={(newValue) => {
                            handleCellUpdate(row.id, column.id, newValue)
                            setEditingCell(null)
                          }}
                        />
                      </td>
                    )
                  })}
                  <td></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )

  return (
    <>
      {mobileView}
      {desktopView}
    </>
  )
}

