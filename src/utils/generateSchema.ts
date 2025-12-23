import type { TableDefinition, TableSchema } from '../types';

export function generateSchema(table: TableDefinition): TableSchema {
  return {
    tableName: table.name || 'Untitled',
    context: table.context,
    columns: table.columns.map(col => ({
      id: col.id,
      type: col.columnType,
      label: col.label,
      sortable: col.sortable,
      filterable: col.filterable,
      editable: col.editable,
      required: col.required,
      width: col.width,
      align: col.align,
      responsiveBehavior: col.responsiveBehavior,
    })),
  };
}

export function downloadSchema(schema: TableSchema) {
  const json = JSON.stringify(schema, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${schema.tableName.toLowerCase().replace(/\s+/g, '-')}-schema.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
