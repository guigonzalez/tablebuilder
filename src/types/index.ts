// Tipos de coluna disponíveis no Design System
export type ColumnTypeId =
  | 'text'
  | 'number'
  | 'currency'
  | 'status'
  | 'date'
  | 'avatar-text'
  | 'checkbox'
  | 'actions'
  // Novos tipos baseados em padrões visuais
  | 'campaign-1line'    // Avatar + título 1 linha + subtítulo
  | 'campaign-2lines'   // Avatar + título 2 linhas + subtítulo
  | 'user-badge'        // Avatar + nome + badge verificado + país
  | 'brand-badge'       // Avatar + nome + badge "You" + URL
  | 'brand-icon'        // Ícone/logo + título truncado
  | 'team-member'       // Avatar iniciais + nome + badges
  | 'list-item';        // Ícone documento + título

// Configuração de tipo de coluna vinda do DS (JSON)
export interface ColumnTypeConfig {
  id: ColumnTypeId;
  label: string;
  component: string;
  minWidth: number;
  defaultWidth?: number;
  icon?: string;
}

// Width mode
export type WidthMode = 'auto' | 'fixed' | 'grow';

// Alinhamento
export type Alignment = 'left' | 'center' | 'right';

// Comportamento responsivo
export type ResponsiveBehavior = 'hide' | 'truncate' | 'stack';

// Definição de uma coluna na tabela
export interface TableColumn {
  id: string;
  label: string;
  columnType: ColumnTypeId;
  width: WidthMode;
  fixedWidth?: number;
  align: Alignment;
  sortable: boolean;
  filterable: boolean;
  editable: boolean;
  required: boolean;
  responsiveBehavior: ResponsiveBehavior;
}

// Definição da tabela
export interface TableDefinition {
  id: string;
  name: string;
  context: string;
  notes: string;
  columns: TableColumn[];
  createdAt: string;
  updatedAt: string;
}

// Estado global da visualização
export type ViewState = 'normal' | 'loading' | 'empty' | 'error';

// Viewport
export type Viewport = 'desktop' | 'tablet';

// Schema de saída
export interface TableSchema {
  tableName: string;
  context: string;
  columns: {
    id: string;
    type: ColumnTypeId;
    label: string;
    sortable: boolean;
    filterable: boolean;
    editable: boolean;
    required: boolean;
    width: WidthMode;
    align: Alignment;
    responsiveBehavior: ResponsiveBehavior;
  }[];
}

// Dados fake para preview
export interface FakeRowData {
  [key: string]: string | number | boolean | null;
}
