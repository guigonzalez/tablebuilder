import { useState, useCallback } from 'react';
import type { TableDefinition, TableColumn, ColumnTypeId, ViewState, Viewport } from '../types';

const generateId = () => Math.random().toString(36).substring(2, 9);

const createDefaultColumn = (columnType: ColumnTypeId = 'text'): TableColumn => ({
  id: generateId(),
  label: 'New Column',
  columnType,
  width: 'auto',
  align: 'left',
  sortable: false,
  filterable: false,
  editable: false,
  required: false,
  responsiveBehavior: 'truncate',
});

const createDefaultTable = (): TableDefinition => ({
  id: generateId(),
  name: '',
  context: '',
  notes: '',
  columns: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export function useTableBuilder() {
  const [table, setTable] = useState<TableDefinition>(createDefaultTable);
  const [viewState, setViewState] = useState<ViewState>('normal');
  const [viewport, setViewport] = useState<Viewport>('desktop');
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);

  const updateTable = useCallback((updates: Partial<Omit<TableDefinition, 'id' | 'createdAt'>>) => {
    setTable(prev => ({
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const addColumn = useCallback((columnType: ColumnTypeId = 'text') => {
    const newColumn = createDefaultColumn(columnType);
    setTable(prev => ({
      ...prev,
      columns: [...prev.columns, newColumn],
      updatedAt: new Date().toISOString(),
    }));
    setSelectedColumnId(newColumn.id);
    return newColumn.id;
  }, []);

  const removeColumn = useCallback((columnId: string) => {
    setTable(prev => ({
      ...prev,
      columns: prev.columns.filter(col => col.id !== columnId),
      updatedAt: new Date().toISOString(),
    }));
    setSelectedColumnId(prev => prev === columnId ? null : prev);
  }, []);

  const updateColumn = useCallback((columnId: string, updates: Partial<Omit<TableColumn, 'id'>>) => {
    setTable(prev => ({
      ...prev,
      columns: prev.columns.map(col =>
        col.id === columnId ? { ...col, ...updates } : col
      ),
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const reorderColumns = useCallback((fromIndex: number, toIndex: number) => {
    setTable(prev => {
      const newColumns = [...prev.columns];
      const [removed] = newColumns.splice(fromIndex, 1);
      newColumns.splice(toIndex, 0, removed);
      return {
        ...prev,
        columns: newColumns,
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  const duplicateColumn = useCallback((columnId: string) => {
    setTable(prev => {
      const columnIndex = prev.columns.findIndex(col => col.id === columnId);
      if (columnIndex === -1) return prev;

      const originalColumn = prev.columns[columnIndex];
      const newColumn: TableColumn = {
        ...originalColumn,
        id: generateId(),
        label: `${originalColumn.label} (copy)`,
      };

      const newColumns = [...prev.columns];
      newColumns.splice(columnIndex + 1, 0, newColumn);

      return {
        ...prev,
        columns: newColumns,
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  const resetTable = useCallback(() => {
    setTable(createDefaultTable());
    setSelectedColumnId(null);
    setViewState('normal');
  }, []);

  const selectedColumn = table.columns.find(col => col.id === selectedColumnId) || null;

  return {
    table,
    updateTable,
    addColumn,
    removeColumn,
    updateColumn,
    reorderColumns,
    duplicateColumn,
    resetTable,
    viewState,
    setViewState,
    viewport,
    setViewport,
    selectedColumnId,
    setSelectedColumnId,
    selectedColumn,
  };
}
