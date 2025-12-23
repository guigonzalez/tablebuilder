import { useState, useMemo } from 'react';
import type { TableColumn, ViewState, Viewport, FakeRowData } from '../types';
import { generateFakeData } from '../utils/generateFakeData';
import { ChevronUpIcon, ChevronDownIcon, MoreHorizontalIcon, AlertCircleIcon, RefreshCwIcon, VerifiedIcon, PenToolIcon } from './Icons';
import styles from './TablePreview.module.css';

interface TablePreviewProps {
  columns: TableColumn[];
  viewState: ViewState;
  viewport: Viewport;
}

type SortDirection = 'asc' | 'desc' | null;

export function TablePreview({ columns, viewState, viewport }: TablePreviewProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [editingCell, setEditingCell] = useState<{ rowId: string; columnId: string } | null>(null);
  const [fakeDataKey, setFakeDataKey] = useState(0);

  const fakeData = useMemo(() => {
    return generateFakeData(columns, 5);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns, fakeDataKey]);

  const sortedData = useMemo(() => {
    if (!sortColumn || !sortDirection) return fakeData;

    return [...fakeData].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];

      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }

      const aStr = String(aVal);
      const bStr = String(bVal);
      return sortDirection === 'asc'
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });
  }, [fakeData, sortColumn, sortDirection]);

  const handleSort = (columnId: string) => {
    if (sortColumn === columnId) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      setSortColumn(columnId);
      setSortDirection('asc');
    }
  };

  const handleCellClick = (rowId: string, column: TableColumn) => {
    if (column.editable) {
      setEditingCell({ rowId, columnId: column.id });
    }
  };

  const visibleColumns = viewport === 'tablet'
    ? columns.filter(col => col.responsiveBehavior !== 'hide')
    : columns;

  const getColumnWidth = (column: TableColumn): string => {
    if (column.width === 'fixed' && column.fixedWidth) {
      return `${column.fixedWidth}px`;
    }
    if (column.width === 'grow') {
      return '1fr';
    }
    return 'auto';
  };

  const renderCell = (column: TableColumn, row: FakeRowData) => {
    const value = row[column.id];
    const isEditing = editingCell?.rowId === row._id && editingCell?.columnId === column.id;

    if (isEditing) {
      return (
        <input
          type="text"
          className={styles.cellInput}
          defaultValue={String(value ?? '')}
          autoFocus
          onBlur={() => setEditingCell(null)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === 'Escape') {
              setEditingCell(null);
            }
          }}
        />
      );
    }

    switch (column.columnType) {
      case 'status': {
        const variant = row[`${column.id}_variant`] as string || 'info';
        return (
          <span className={`${styles.badge} ${styles[`badge${variant.charAt(0).toUpperCase()}${variant.slice(1)}`]}`}>
            {String(value)}
          </span>
        );
      }

      case 'avatar-text':
        return (
          <div className={styles.avatarCell}>
            <div className={styles.avatar}>
              {String(value).charAt(0).toUpperCase()}
            </div>
            <span>{String(value)}</span>
          </div>
        );

      case 'checkbox':
        return (
          <input
            type="checkbox"
            checked={Boolean(value)}
            readOnly
            className={styles.checkbox}
          />
        );

      case 'actions':
        return (
          <button className={styles.actionsButton}>
            <MoreHorizontalIcon size={16} />
          </button>
        );

      case 'number':
      case 'currency':
        return (
          <span className={styles.numberCell}>
            {String(value)}
          </span>
        );

      // Novos tipos de coluna
      case 'campaign-1line': {
        const subtitle = row[`${column.id}_subtitle`] as string || '';
        return (
          <div className={styles.campaignCell}>
            <div className={styles.campaignAvatar}>
              <span className={styles.campaignAvatarFallback}>
                {String(value).charAt(0).toUpperCase()}
              </span>
            </div>
            <div className={styles.campaignContent}>
              <span className={styles.campaignTitle}>{String(value)}</span>
              <span className={styles.campaignSubtitle}>{subtitle}</span>
            </div>
          </div>
        );
      }

      case 'campaign-2lines': {
        const subtitle = row[`${column.id}_subtitle`] as string || '';
        return (
          <div className={styles.campaignCell}>
            <div className={styles.campaignAvatar}>
              <span className={styles.campaignAvatarFallback}>
                {String(value).charAt(0).toUpperCase()}
              </span>
            </div>
            <div className={styles.campaignContent}>
              <span className={styles.campaignTitle2Lines}>{String(value)}</span>
              <span className={styles.campaignSubtitle}>{subtitle}</span>
            </div>
          </div>
        );
      }

      case 'user-badge': {
        const location = row[`${column.id}_location`] as string || '';
        const verified = row[`${column.id}_verified`] as boolean || false;
        return (
          <div className={styles.userBadgeCell}>
            <div className={styles.userBadgeAvatar}>
              <span className={styles.userBadgeAvatarFallback}>
                {String(value).charAt(0).toUpperCase()}
              </span>
            </div>
            <div className={styles.userBadgeContent}>
              <div className={styles.userBadgeNameRow}>
                <span className={styles.userBadgeName}>{String(value)}</span>
                {verified && (
                  <span className={styles.verifiedBadge}>
                    <VerifiedIcon size={14} color="#F97316" />
                  </span>
                )}
              </div>
              <span className={styles.userBadgeLocation}>{location}</span>
            </div>
          </div>
        );
      }

      case 'brand-badge': {
        const url = row[`${column.id}_url`] as string || '';
        const isYou = row[`${column.id}_isYou`] as boolean || false;
        return (
          <div className={styles.brandBadgeCell}>
            <div className={styles.brandBadgeAvatar}>
              <span className={styles.brandBadgeAvatarFallback}>
                {String(value).charAt(0).toUpperCase()}
              </span>
            </div>
            <div className={styles.brandBadgeContent}>
              <div className={styles.brandBadgeNameRow}>
                <span className={styles.brandBadgeName}>{String(value)}</span>
                {isYou && <span className={styles.youBadge}>You</span>}
              </div>
              <span className={styles.brandBadgeUrl}>{url}</span>
            </div>
          </div>
        );
      }

      case 'brand-icon':
        return (
          <div className={styles.brandIconCell}>
            <div className={styles.brandIconLogo}>
              <span className={styles.brandIconLogoFallback}>
                <PenToolIcon size={20} />
              </span>
            </div>
            <span className={styles.brandIconTitle}>{String(value)}</span>
          </div>
        );

      case 'team-member': {
        const initials = row[`${column.id}_initials`] as string || String(value).substring(0, 2).toUpperCase();
        const badgeCount = row[`${column.id}_badgeCount`] as number || 0;
        return (
          <div className={styles.teamMemberCell}>
            <div className={styles.teamMemberAvatar}>
              {initials}
            </div>
            <div className={styles.teamMemberContent}>
              <span className={styles.teamMemberName}>{String(value)}</span>
              {badgeCount > 0 && (
                <div className={styles.teamMemberBadges}>
                  {Array.from({ length: badgeCount }).map((_, i) => (
                    <span key={i} className={styles.youBadge}>You</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      }

      case 'list-item':
        return (
          <div className={styles.listItemCell}>
            <div className={styles.listItemIcon}>
              <PenToolIcon size={16} />
            </div>
            <span className={styles.listItemTitle}>{String(value)}</span>
          </div>
        );

      default:
        return <span>{String(value ?? '')}</span>;
    }
  };

  if (columns.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>Add columns to view the table</p>
      </div>
    );
  }

  if (viewState === 'loading') {
    return (
      <div className={`${styles.container} ${viewport === 'tablet' ? styles.tablet : ''}`}>
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner} />
          <p>Loading...</p>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              {visibleColumns.map((column) => (
                <th key={column.id} style={{ textAlign: column.align }}>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map((i) => (
              <tr key={i}>
                {visibleColumns.map((column) => (
                  <td key={column.id}>
                    <div className={styles.skeleton} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (viewState === 'empty') {
    return (
      <div className={`${styles.container} ${viewport === 'tablet' ? styles.tablet : ''}`}>
        <table className={styles.table}>
          <thead>
            <tr>
              {visibleColumns.map((column) => (
                <th key={column.id} style={{ textAlign: column.align }}>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
        </table>
        <div className={styles.emptyTableState}>
          <p>No data found</p>
          <span>Add items to get started</span>
        </div>
      </div>
    );
  }

  if (viewState === 'error') {
    return (
      <div className={`${styles.container} ${viewport === 'tablet' ? styles.tablet : ''}`}>
        <div className={styles.errorState}>
          <AlertCircleIcon size={32} color="var(--color-error)" />
          <p>Error loading data</p>
          <span>Could not load table data</span>
          <button className={styles.retryButton}>
            <RefreshCwIcon size={14} />
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${viewport === 'tablet' ? styles.tablet : ''}`}>
      <div className={styles.tableActions}>
        <button
          className={styles.refreshButton}
          onClick={() => setFakeDataKey(k => k + 1)}
          title="Generate new fake data"
        >
          <RefreshCwIcon size={14} />
          New data
        </button>
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {visibleColumns.map((column) => (
                <th
                  key={column.id}
                  style={{
                    textAlign: column.align,
                    width: getColumnWidth(column),
                  }}
                  className={column.sortable ? styles.sortable : ''}
                  onClick={() => column.sortable && handleSort(column.id)}
                >
                  <div className={styles.headerContent}>
                    <span>{column.label}</span>
                    {column.sortable && (
                      <span className={styles.sortIcon}>
                        {sortColumn === column.id ? (
                          sortDirection === 'asc' ? (
                            <ChevronUpIcon size={14} />
                          ) : (
                            <ChevronDownIcon size={14} />
                          )
                        ) : (
                          <ChevronUpIcon size={14} color="var(--color-text-disabled)" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row) => (
              <tr key={row._id as string}>
                {visibleColumns.map((column) => (
                  <td
                    key={column.id}
                    style={{ textAlign: column.align }}
                    className={`
                      ${column.editable ? styles.editable : ''}
                      ${viewport === 'tablet' && column.responsiveBehavior === 'truncate' ? styles.truncate : ''}
                    `}
                    onClick={() => handleCellClick(row._id as string, column)}
                  >
                    {renderCell(column, row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
