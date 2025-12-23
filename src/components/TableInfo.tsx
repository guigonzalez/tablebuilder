import type { TableDefinition } from '../types';
import styles from './TableInfo.module.css';

interface TableInfoProps {
  table: TableDefinition;
  onUpdate: (updates: Partial<Pick<TableDefinition, 'name' | 'context' | 'notes'>>) => void;
}

export function TableInfo({ table, onUpdate }: TableInfoProps) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Table Information</h2>

      <div className={styles.field}>
        <label htmlFor="table-name" className={styles.label}>
          Table name <span className={styles.required}>*</span>
        </label>
        <input
          id="table-name"
          type="text"
          className={styles.input}
          value={table.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          placeholder="e.g.: Orders, Users, Products..."
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="table-context" className={styles.label}>
          Context
        </label>
        <input
          id="table-context"
          type="text"
          className={styles.input}
          value={table.context}
          onChange={(e) => onUpdate({ context: e.target.value })}
          placeholder="e.g.: E-commerce order list"
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="table-notes" className={styles.label}>
          Notes
        </label>
        <textarea
          id="table-notes"
          className={styles.textarea}
          value={table.notes}
          onChange={(e) => onUpdate({ notes: e.target.value })}
          placeholder="Free notes about the table..."
          rows={3}
        />
      </div>
    </div>
  );
}
