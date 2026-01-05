'use client'

interface RowMenuProps {
  rowId: string
  onDelete?: () => void
  onDuplicate?: () => void
  onAdd?: () => void
}

export function RowMenu({ rowId, onDelete, onDuplicate, onAdd }: RowMenuProps) {
  if (onAdd) {
    return (
      <button
        onClick={onAdd}
        className="text-2xl hover:scale-110 transition-transform"
        title="Add row"
      >
        ➕
      </button>
    )
  }

  return (
    <div className="flex items-center gap-1">
      {onDuplicate && (
        <button
          onClick={onDuplicate}
          className="text-gray-400 hover:text-gray-600 text-lg transition-colors"
          title="Duplicate row"
        >
          🪄
        </button>
      )}
      {onDelete && (
        <button
          onClick={onDelete}
          className="text-gray-400 hover:text-red-600 text-lg transition-colors"
          title="Delete row"
        >
          🗑️
        </button>
      )}
    </div>
  )
}

