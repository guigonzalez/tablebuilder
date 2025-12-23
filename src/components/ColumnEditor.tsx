import type { TableColumn, ColumnTypeId, WidthMode, Alignment, ResponsiveBehavior } from '../types';
import columnTypesConfig from '../config/columnTypes.json';
import { columnTypeIcons } from './Icons';
import styles from './ColumnEditor.module.css';

interface ColumnEditorProps {
  column: TableColumn;
  onUpdate: (updates: Partial<Omit<TableColumn, 'id'>>) => void;
}

export function ColumnEditor({ column, onUpdate }: ColumnEditorProps) {
  const typeConfig = columnTypesConfig.columnTypes.find(t => t.id === column.columnType);
  const Icon = columnTypeIcons[column.columnType] || columnTypeIcons.text;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.typeIcon}>
          <Icon size={20} />
        </div>
        <div>
          <h3 className={styles.title}>Edit Column</h3>
          <span className={styles.typeName}>{typeConfig?.label}</span>
        </div>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Basic Properties</h4>

        <div className={styles.field}>
          <label htmlFor="col-label" className={styles.label}>
            Label <span className={styles.required}>*</span>
          </label>
          <input
            id="col-label"
            type="text"
            className={styles.input}
            value={column.label}
            onChange={(e) => onUpdate({ label: e.target.value })}
            placeholder="Column name"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="col-type" className={styles.label}>
            Column Type
          </label>
          <select
            id="col-type"
            className={styles.select}
            value={column.columnType}
            onChange={(e) => onUpdate({ columnType: e.target.value as ColumnTypeId })}
          >
            {columnTypesConfig.columnTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="col-width" className={styles.label}>
              Width
            </label>
            <select
              id="col-width"
              className={styles.select}
              value={column.width}
              onChange={(e) => onUpdate({ width: e.target.value as WidthMode })}
            >
              <option value="auto">Auto</option>
              <option value="fixed">Fixed</option>
              <option value="grow">Grow</option>
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="col-align" className={styles.label}>
              Alignment
            </label>
            <select
              id="col-align"
              className={styles.select}
              value={column.align}
              onChange={(e) => onUpdate({ align: e.target.value as Alignment })}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
        </div>

        {column.width === 'fixed' && (
          <div className={styles.field}>
            <label htmlFor="col-fixed-width" className={styles.label}>
              Fixed Width (px)
            </label>
            <input
              id="col-fixed-width"
              type="number"
              className={styles.input}
              value={column.fixedWidth || typeConfig?.defaultWidth || 150}
              onChange={(e) => onUpdate({ fixedWidth: parseInt(e.target.value) || 100 })}
              min={typeConfig?.minWidth || 50}
            />
          </div>
        )}
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Behaviors</h4>

        <div className={styles.checkboxGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={column.sortable}
              onChange={(e) => onUpdate({ sortable: e.target.checked })}
            />
            <span className={styles.checkboxText}>
              <strong>Sortable</strong>
              <small>Allows sorting the table by this column</small>
            </span>
          </label>

          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={column.filterable}
              onChange={(e) => onUpdate({ filterable: e.target.checked })}
            />
            <span className={styles.checkboxText}>
              <strong>Filterable</strong>
              <small>Allows filtering the table by this column</small>
            </span>
          </label>

          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={column.editable}
              onChange={(e) => onUpdate({ editable: e.target.checked })}
            />
            <span className={styles.checkboxText}>
              <strong>Editable</strong>
              <small>Allows inline editing of the value</small>
            </span>
          </label>

          {column.editable && (
            <label className={`${styles.checkboxLabel} ${styles.checkboxIndented}`}>
              <input
                type="checkbox"
                checked={column.required}
                onChange={(e) => onUpdate({ required: e.target.checked })}
              />
              <span className={styles.checkboxText}>
                <strong>Required</strong>
                <small>Field cannot be empty</small>
              </span>
            </label>
          )}
        </div>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Responsive Behavior</h4>

        <div className={styles.field}>
          <label htmlFor="col-responsive" className={styles.label}>
            On smaller screens
          </label>
          <select
            id="col-responsive"
            className={styles.select}
            value={column.responsiveBehavior}
            onChange={(e) => onUpdate({ responsiveBehavior: e.target.value as ResponsiveBehavior })}
          >
            <option value="truncate">Truncate text</option>
            <option value="hide">Hide column</option>
            <option value="stack">Stack content</option>
          </select>
          <p className={styles.hint}>
            {column.responsiveBehavior === 'truncate' && 'Text will be cut off with ellipsis when it doesn\'t fit.'}
            {column.responsiveBehavior === 'hide' && 'Column will be hidden on smaller viewports.'}
            {column.responsiveBehavior === 'stack' && 'Content will be stacked vertically.'}
          </p>
        </div>
      </div>
    </div>
  );
}
