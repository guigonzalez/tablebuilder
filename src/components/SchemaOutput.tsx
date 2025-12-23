import { useMemo, useState } from 'react';
import type { TableDefinition } from '../types';
import { generateSchema, downloadSchema } from '../utils/generateSchema';
import { DownloadIcon, CopyIcon, FileTextIcon } from './Icons';
import styles from './SchemaOutput.module.css';

interface SchemaOutputProps {
  table: TableDefinition;
}

export function SchemaOutput({ table }: SchemaOutputProps) {
  const [copied, setCopied] = useState(false);

  const schema = useMemo(() => generateSchema(table), [table]);
  const schemaJson = useMemo(() => JSON.stringify(schema, null, 2), [schema]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(schemaJson);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    downloadSchema(schema);
  };

  if (table.columns.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <FileTextIcon size={18} />
          <h3 className={styles.title}>Schema JSON</h3>
        </div>
        <div className={styles.actions}>
          <button
            className={styles.actionButton}
            onClick={handleCopy}
            title="Copy schema"
          >
            <CopyIcon size={14} />
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            className={styles.actionButton}
            onClick={handleDownload}
            title="Download schema"
          >
            <DownloadIcon size={14} />
            Download
          </button>
        </div>
      </div>
      <pre className={styles.code}>
        <code>{schemaJson}</code>
      </pre>
    </div>
  );
}
