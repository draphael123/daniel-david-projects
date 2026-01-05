'use client'

import { useState, useRef, useEffect } from 'react'

interface Column {
  id: string
  name: string
  type: string
  settingsJson: any
}

interface CellEditorProps {
  column: Column
  value: any
  isEditing: boolean
  onStartEdit: () => void
  onCancelEdit: () => void
  onSave: (value: string) => void
}

export function CellEditor({
  column,
  value,
  isEditing,
  onStartEdit,
  onCancelEdit,
  onSave,
}: CellEditorProps) {
  const [editValue, setEditValue] = useState('')
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(null)

  useEffect(() => {
    if (isEditing) {
      if (column.type === 'checkbox') {
        setEditValue(value ? 'true' : 'false')
      } else if (column.type === 'multi_select') {
        setEditValue(Array.isArray(value) ? value.join(', ') : '')
      } else if (column.type === 'date') {
        setEditValue(value || '')
      } else {
        setEditValue(value != null ? String(value) : '')
      }
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [isEditing, column.type, value])

  const handleSave = () => {
    let valueToSave = editValue.trim()

    if (column.type === 'checkbox') {
      valueToSave = editValue === 'true' ? 'true' : 'false'
    } else if (column.type === 'multi_select') {
      const options = valueToSave.split(',').map(s => s.trim()).filter(Boolean)
      onSave(JSON.stringify(options))
      return
    } else if (column.type === 'date') {
      // Validate date format
      if (valueToSave && !/^\d{4}-\d{2}-\d{2}$/.test(valueToSave)) {
        return // Invalid date, don't save
      }
    } else if (column.type === 'url') {
      if (valueToSave && !valueToSave.startsWith('http://') && !valueToSave.startsWith('https://')) {
        valueToSave = 'https://' + valueToSave
      }
    } else if (column.type === 'number') {
      if (valueToSave && isNaN(parseFloat(valueToSave))) {
        return // Invalid number, don't save
      }
    }

    if (valueToSave === '') {
      onSave('')
    } else {
      onSave(valueToSave)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && column.type !== 'multi_select' && column.type !== 'text') {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      onCancelEdit()
    }
  }

  if (!isEditing) {
    // Display mode
    if (column.type === 'checkbox') {
      return (
        <div
          className="cursor-pointer text-center py-1"
          onClick={onStartEdit}
        >
          {value ? '✅' : '☐'}
        </div>
      )
    }

    if (column.type === 'select' || column.type === 'multi_select') {
      let settings: any = {}
      try {
        settings = column.settingsJson ? JSON.parse(column.settingsJson as string) : {}
      } catch {
        settings = {}
      }
      const options = settings?.options || []
      
      if (column.type === 'multi_select') {
        const values = Array.isArray(value) ? value : []
        if (values.length === 0) {
          return (
            <div
              className="cursor-text text-gray-400 py-1 px-2 hover:bg-gray-50 rounded"
              onClick={onStartEdit}
            >
              Empty
            </div>
          )
        }
        return (
          <div
            className="cursor-text py-1 flex flex-wrap gap-1"
            onClick={onStartEdit}
          >
            {values.map((val: string, idx: number) => {
              const option = options.find((opt: any) => opt.label === val)
              const colorMap: Record<string, string> = {
                gray: 'bg-gray-200 text-gray-800',
                red: 'bg-red-200 text-red-800',
                blue: 'bg-blue-200 text-blue-800',
                green: 'bg-green-200 text-green-800',
                yellow: 'bg-yellow-200 text-yellow-800',
                orange: 'bg-orange-200 text-orange-800',
                purple: 'bg-purple-200 text-purple-800',
                pink: 'bg-pink-200 text-pink-800',
                teal: 'bg-teal-200 text-teal-800',
              }
              const colorClass = option?.color ? colorMap[option.color] || 'bg-gray-200' : 'bg-gray-200'
              return (
                <span
                  key={idx}
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${colorClass}`}
                >
                  {val}
                </span>
              )
            })}
          </div>
        )
      } else {
        // Single select
        if (!value) {
          return (
            <div
              className="cursor-text text-gray-400 py-1 px-2 hover:bg-gray-50 rounded"
              onClick={onStartEdit}
            >
              Empty
            </div>
          )
        }
        const option = options.find((opt: any) => opt.label === value)
        const colorMap: Record<string, string> = {
          gray: 'bg-gray-200 text-gray-800',
          red: 'bg-red-200 text-red-800',
          blue: 'bg-blue-200 text-blue-800',
          green: 'bg-green-200 text-green-800',
          yellow: 'bg-yellow-200 text-yellow-800',
          orange: 'bg-orange-200 text-orange-800',
          purple: 'bg-purple-200 text-purple-800',
          pink: 'bg-pink-200 text-pink-800',
          teal: 'bg-teal-200 text-teal-800',
        }
        const colorClass = option?.color ? colorMap[option.color] || 'bg-gray-200' : 'bg-gray-200'
        return (
          <div
            className="cursor-text py-1"
            onClick={onStartEdit}
          >
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
              {value}
            </span>
          </div>
        )
      }
    }

    if (column.type === 'url' && value) {
      return (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer text-blue-600 hover:underline py-1 px-2"
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          🔗 {value.length > 30 ? value.substring(0, 30) + '...' : value}
        </a>
      )
    }

    if (value == null || value === '') {
      return (
        <div
          className="cursor-text text-gray-400 py-1 px-2 hover:bg-gray-50 rounded"
          onClick={onStartEdit}
        >
          Empty
        </div>
      )
    }

    return (
      <div
        className="cursor-text py-1 px-2 hover:bg-gray-50 rounded"
        onClick={onStartEdit}
      >
        {String(value)}
      </div>
    )
  }

  // Edit mode
  if (column.type === 'checkbox') {
    return (
      <div className="flex items-center gap-2">
        <input
          ref={inputRef as any}
          type="checkbox"
          checked={editValue === 'true'}
          onChange={(e) => {
            setEditValue(e.target.checked ? 'true' : 'false')
            handleSave()
          }}
          className="cursor-pointer"
        />
        <button
          onClick={onCancelEdit}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
    )
  }

  if (column.type === 'select') {
    const settings = column.settingsJson as any
    const options = settings?.options || []
    return (
      <select
        ref={inputRef as any}
        value={editValue}
        onChange={(e) => {
          setEditValue(e.target.value)
          onSave(e.target.value)
        }}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        autoFocus
      >
        <option value="">-- Select --</option>
        {options.map((opt: any, idx: number) => (
          <option key={idx} value={opt.label}>
            {opt.label}
          </option>
        ))}
      </select>
    )
  }

  if (column.type === 'date') {
    return (
      <input
        ref={inputRef as any}
        type="date"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        autoFocus
      />
    )
  }

  if (column.type === 'multi_select') {
    const settings = column.settingsJson as any
    const options = settings?.options || []
    const currentValues = editValue.split(',').map(s => s.trim()).filter(Boolean)
    
    return (
      <div className="space-y-2">
        <div className="flex flex-wrap gap-1 mb-2">
          {options.map((opt: any, idx: number) => {
            const isSelected = currentValues.includes(opt.label)
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  const newValues = isSelected
                    ? currentValues.filter(v => v !== opt.label)
                    : [...currentValues, opt.label]
                  setEditValue(newValues.join(', '))
                }}
                className={`px-2 py-1 rounded-full text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
        <input
          ref={inputRef as any}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          placeholder="Or type comma-separated values"
          className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <div className="flex gap-1">
          <button
            onClick={handleSave}
            className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
          >
            ✓ Save
          </button>
          <button
            onClick={onCancelEdit}
            className="text-xs bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
          >
            ✕ Cancel
          </button>
        </div>
      </div>
    )
  }

  if (column.type === 'text') {
    return (
      <textarea
        ref={inputRef as any}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            handleSave()
          } else if (e.key === 'Escape') {
            onCancelEdit()
          }
        }}
        className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
        rows={2}
        autoFocus
      />
    )
  }

  return (
    <input
      ref={inputRef as any}
      type={column.type === 'number' ? 'number' : column.type === 'url' ? 'url' : 'text'}
      value={editValue}
      onChange={(e) => setEditValue(e.target.value)}
      onBlur={handleSave}
      onKeyDown={handleKeyDown}
      className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
      autoFocus
    />
  )
}

