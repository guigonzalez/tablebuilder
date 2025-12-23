import { useTableBuilder } from './hooks/useTableBuilder';
import { TableInfo } from './components/TableInfo';
import { ColumnList } from './components/ColumnList';
import { ColumnEditor } from './components/ColumnEditor';
import { TablePreview } from './components/TablePreview';
import { ViewControls } from './components/ViewControls';
import { SchemaOutput } from './components/SchemaOutput';
import { RefreshCwIcon } from './components/Icons';
import styles from './App.module.css';

function App() {
  const {
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
  } = useTableBuilder();

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <h1 className={styles.title}>Table Builder</h1>
            <p className={styles.subtitle}>Table Inconsistency Detector</p>
          </div>
          <button className={styles.resetButton} onClick={resetTable}>
            <RefreshCwIcon size={14} />
            New Table
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.sidebar}>
          <TableInfo table={table} onUpdate={updateTable} />

          <ColumnList
            columns={table.columns}
            selectedColumnId={selectedColumnId}
            onSelectColumn={setSelectedColumnId}
            onAddColumn={addColumn}
            onRemoveColumn={removeColumn}
            onDuplicateColumn={duplicateColumn}
            onReorderColumns={reorderColumns}
          />

          {selectedColumn && (
            <ColumnEditor
              column={selectedColumn}
              onUpdate={(updates) => updateColumn(selectedColumn.id, updates)}
            />
          )}
        </div>

        <div className={styles.content}>
          <div className={styles.previewHeader}>
            <h2 className={styles.previewTitle}>
              Preview: {table.name || 'Untitled Table'}
            </h2>
            <ViewControls
              viewState={viewState}
              onViewStateChange={setViewState}
              viewport={viewport}
              onViewportChange={setViewport}
            />
          </div>

          <TablePreview
            columns={table.columns}
            viewState={viewState}
            viewport={viewport}
          />

          <SchemaOutput table={table} />
        </div>
      </main>

      <footer className={styles.footer}>
        <p>
          If the PM looks at it and thinks <em>"this is going to be a problem"</em>, the product has served its purpose.
        </p>
      </footer>
    </div>
  );
}

export default App;
