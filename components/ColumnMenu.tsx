'use client'

import { useState, useRef, useEffect } from 'react'
import { updateColumn, deleteColumn } from '@/app/actions/columns'
import toast from 'react-hot-toast'

interface Column {
  id: string
  name: string
  type: string
  orderIndex: number
  settingsJson: any
}

interface ColumnMenuProps {
  column: Column
  onUpdate: () => void
  onDelete: () => void
}

export function ColumnMenu({ column, onUpdate, onDelete }: ColumnMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showRename, setShowRename] = useState(false)
  const [showTypeChange, setShowTypeChange] = useState(false)
  const [showOptionsEdit, setShowOptionsEdit] = useState(false)
  const [newName, setNewName] = useState(column.name)
  const [newType, setNewType] = useState(column.type)
  const [newOptions, setNewOptions] = useState<string>('')
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (column.type === 'select' || column.type === 'multi_select') {
      const settings = column.settingsJson as any
      const options = settings?.options || []
      setNewOptions(options.map((opt: any) => opt.label).join('\n'))
    }
  }, [column])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setShowRename(false)
        setShowTypeChange(false)
        setShowOptionsEdit(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleRename = async () => {
    if (!newName.trim()) {
      toast.error('Column name cannot be empty')
      return
    }

    const formData = new FormData()
    formData.append('name', newName)

    const result = await updateColumn(column.id, formData)
    if (result.success) {
      toast.success('Column renamed! 🪄')
      setShowRename(false)
      setIsOpen(false)
      onUpdate()
    } else {
      toast.error(result.error || 'Failed to rename column')
    }
  }

  const handleTypeChange = async () => {
    const formData = new FormData()
    formData.append('type', newType)

    // Reset settings if changing from select/multi_select
    if ((column.type === 'select' || column.type === 'multi_select') && 
        (newType !== 'select' && newType !== 'multi_select')) {
      formData.append('settingsJson', JSON.stringify(null))
    } else if ((newType === 'select' || newType === 'multi_select') && 
               (column.type !== 'select' && column.type !== 'multi_select')) {
      formData.append('settingsJson', JSON.stringify({ options: [] }))
    }

    const result = await updateColumn(column.id, formData)
    if (result.success) {
      toast.success('Column type changed! 🔄')
      setShowTypeChange(false)
      setIsOpen(false)
      onUpdate()
    } else {
      toast.error(result.error || 'Failed to change column type')
    }
  }

  const handleOptionsSave = async () => {
    const options = newOptions
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .map(label => ({ label, color: 'gray' }))

    const formData = new FormData()
    formData.append('settingsJson', JSON.stringify({ options }))

    const result = await updateColumn(column.id, formData)
    if (result.success) {
      toast.success('Options updated! ✅')
      setShowOptionsEdit(false)
      setIsOpen(false)
      onUpdate()
    } else {
      toast.error(result.error || 'Failed to update options')
    }
  }

  const handleDelete = async () => {
    if (!confirm(`Delete column "${column.name}"? 🗑️`)) return

    const result = await deleteColumn(column.id)
    if (result.success) {
      toast.success('Column deleted! 🗑️')
      setIsOpen(false)
      onDelete()
    } else {
      toast.error(result.error || 'Failed to delete column')
    }
  }

  if (showRename) {
    return (
      <div ref={menuRef} className="relative">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleRename()
            if (e.key === 'Escape') {
              setShowRename(false)
              setNewName(column.name)
            }
          }}
          className="w-32 px-2 py-1 text-xs border rounded"
          autoFocus
        />
        <div className="flex gap-1 mt-1">
          <button
            onClick={handleRename}
            className="text-xs bg-green-500 text-white px-2 py-1 rounded"
          >
            ✓
          </button>
          <button
            onClick={() => {
              setShowRename(false)
              setNewName(column.name)
            }}
            className="text-xs bg-gray-500 text-white px-2 py-1 rounded"
          >
            ✕
          </button>
        </div>
      </div>
    )
  }

  if (showTypeChange) {
    return (
      <div ref={menuRef} className="relative">
        <select
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
          className="text-xs border rounded px-2 py-1"
        >
          <option value="text">Text</option>
          <option value="number">Number</option>
          <option value="select">Select</option>
          <option value="multi_select">Multi-select</option>
          <option value="date">Date</option>
          <option value="checkbox">Checkbox</option>
          <option value="url">URL</option>
        </select>
        <div className="flex gap-1 mt-1">
          <button
            onClick={handleTypeChange}
            className="text-xs bg-green-500 text-white px-2 py-1 rounded"
          >
            ✓
          </button>
          <button
            onClick={() => {
              setShowTypeChange(false)
              setNewType(column.type)
            }}
            className="text-xs bg-gray-500 text-white px-2 py-1 rounded"
          >
            ✕
          </button>
        </div>
      </div>
    )
  }

  if (showOptionsEdit) {
    return (
      <div ref={menuRef} className="absolute top-full right-0 mt-1 bg-white border rounded shadow-lg p-3 z-50 min-w-[200px]">
        <label className="text-xs font-semibold block mb-2">Options (one per line):</label>
        <textarea
          value={newOptions}
          onChange={(e) => setNewOptions(e.target.value)}
          className="w-full px-2 py-1 border rounded text-xs mb-2"
          rows={5}
          autoFocus
        />
        <div className="flex gap-1">
          <button
            onClick={handleOptionsSave}
            className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
          >
            ✓ Save
          </button>
          <button
            onClick={() => {
              setShowOptionsEdit(false)
              const settings = column.settingsJson as any
              const options = settings?.options || []
              setNewOptions(options.map((opt: any) => opt.label).join('\n'))
            }}
            className="text-xs bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
          >
            ✕ Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-400 hover:text-gray-600 text-lg opacity-0 group-hover:opacity-100 transition-opacity"
        title="Column options"
      >
        ⋮
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-white border rounded shadow-lg z-50 min-w-[150px]">
          <button
            onClick={() => {
              setShowRename(true)
            }}
            className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
          >
            ✏️ Rename
          </button>
          <button
            onClick={() => {
              setShowTypeChange(true)
            }}
            className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
          >
            🔄 Change Type
          </button>
          {(column.type === 'select' || column.type === 'multi_select') && (
            <button
              onClick={() => {
                setShowOptionsEdit(true)
              }}
              className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
            >
              ⚙️ Edit Options
            </button>
          )}
          <button
            onClick={handleDelete}
            className="block w-full text-left px-3 py-2 text-sm hover:bg-red-100 text-red-600"
          >
            🗑️ Delete
          </button>
        </div>
      )}
    </div>
  )
}

