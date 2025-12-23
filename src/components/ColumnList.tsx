import { useState } from 'react';
import type { TableColumn, ColumnTypeId } from '../types';
import columnTypesConfig from '../config/columnTypes.json';
import { columnTypeIcons, PlusIcon, TrashIcon, CopyIcon, GripVerticalIcon, ChevronUpIcon, ChevronDownIcon } from './Icons';
import styles from './ColumnList.module.css';

interface ColumnListProps {
  columns: TableColumn[];
  selectedColumnId: string | null;
  onSelectColumn: (id: string | null) => void;
  onAddColumn: (type: ColumnTypeId) => void;
  onRemoveColumn: (id: string) => void;
  onDuplicateColumn: (id: string) => void;
  onReorderColumns: (fromIndex: number, toIndex: number) => void;
}

export function ColumnList({
  columns,
  selectedColumnId,
  onSelectColumn,
  onAddColumn,
  onRemoveColumn,
  onDuplicateColumn,
  onReorderColumns,
}: ColumnListProps) {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      onReorderColumns(draggedIndex, index);
      setDraggedIndex(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const moveColumn = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < columns.length) {
      onReorderColumns(index, newIndex);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Columns ({columns.length})</h2>
        <div className={styles.addWrapper}>
          <button
            className={styles.addButton}
            onClick={() => setShowAddMenu(!showAddMenu)}
            aria-expanded={showAddMenu}
          >
            <PlusIcon size={16} />
            Add
          </button>
          {showAddMenu && (
            <div className={styles.addMenu}>
              {columnTypesConfig.columnTypes.map((type) => {
                const Icon = columnTypeIcons[type.id] || columnTypeIcons.text;
                return (
                  <button
                    key={type.id}
                    className={styles.addMenuItem}
                    onClick={() => {
                      onAddColumn(type.id as ColumnTypeId);
                      setShowAddMenu(false);
                    }}
                  >
                    <Icon size={16} />
                    <span>{type.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {columns.length === 0 ? (
        <div className={styles.empty}>
          <p>No columns added.</p>
          <p className={styles.emptyHint}>
            Click "Add" to get started.
          </p>
        </div>
      ) : (
        <ul className={styles.list}>
          {columns.map((column, index) => {
            const typeConfig = columnTypesConfig.columnTypes.find(t => t.id === column.columnType);
            const Icon = columnTypeIcons[column.columnType] || columnTypeIcons.text;
            const isSelected = selectedColumnId === column.id;

            return (
              <li
                key={column.id}
                className={`${styles.item} ${isSelected ? styles.itemSelected : ''} ${draggedIndex === index ? styles.itemDragging : ''}`}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                onClick={() => onSelectColumn(isSelected ? null : column.id)}
              >
                <div className={styles.dragHandle}>
                  <GripVerticalIcon size={16} color="var(--color-text-tertiary)" />
                </div>

                <div className={styles.columnInfo}>
                  <div className={styles.columnIcon}>
                    <Icon size={16} />
                  </div>
                  <div className={styles.columnDetails}>
                    <span className={styles.columnLabel}>{column.label || 'Untitled'}</span>
                    <span className={styles.columnType}>{typeConfig?.label || column.columnType}</span>
                  </div>
                </div>

                <div className={styles.columnBadges}>
                  {column.sortable && <span className={styles.badge}>Sort</span>}
                  {column.filterable && <span className={styles.badge}>Filter</span>}
                  {column.editable && <span className={styles.badge}>Edit</span>}
                </div>

                <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
                  <button
                    className={styles.actionButton}
                    onClick={() => moveColumn(index, 'up')}
                    disabled={index === 0}
                    title="Move up"
                  >
                    <ChevronUpIcon size={14} />
                  </button>
                  <button
                    className={styles.actionButton}
                    onClick={() => moveColumn(index, 'down')}
                    disabled={index === columns.length - 1}
                    title="Move down"
                  >
                    <ChevronDownIcon size={14} />
                  </button>
                  <button
                    className={styles.actionButton}
                    onClick={() => onDuplicateColumn(column.id)}
                    title="Duplicate"
                  >
                    <CopyIcon size={14} />
                  </button>
                  <button
                    className={`${styles.actionButton} ${styles.actionButtonDanger}`}
                    onClick={() => onRemoveColumn(column.id)}
                    title="Remove"
                  >
                    <TrashIcon size={14} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
