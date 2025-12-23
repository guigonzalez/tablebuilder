import type { ViewState, Viewport } from '../types';
import { MonitorIcon, TabletIcon } from './Icons';
import styles from './ViewControls.module.css';

interface ViewControlsProps {
  viewState: ViewState;
  onViewStateChange: (state: ViewState) => void;
  viewport: Viewport;
  onViewportChange: (viewport: Viewport) => void;
}

const viewStates: { value: ViewState; label: string }[] = [
  { value: 'normal', label: 'Normal' },
  { value: 'loading', label: 'Loading' },
  { value: 'empty', label: 'Empty' },
  { value: 'error', label: 'Error' },
];

export function ViewControls({
  viewState,
  onViewStateChange,
  viewport,
  onViewportChange,
}: ViewControlsProps) {
  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <span className={styles.label}>State:</span>
        <div className={styles.buttonGroup}>
          {viewStates.map(({ value, label }) => (
            <button
              key={value}
              className={`${styles.button} ${viewState === value ? styles.buttonActive : ''}`}
              onClick={() => onViewStateChange(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <span className={styles.label}>Viewport:</span>
        <div className={styles.buttonGroup}>
          <button
            className={`${styles.iconButton} ${viewport === 'desktop' ? styles.buttonActive : ''}`}
            onClick={() => onViewportChange('desktop')}
            title="Desktop"
          >
            <MonitorIcon size={18} />
          </button>
          <button
            className={`${styles.iconButton} ${viewport === 'tablet' ? styles.buttonActive : ''}`}
            onClick={() => onViewportChange('tablet')}
            title="Tablet"
          >
            <TabletIcon size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
