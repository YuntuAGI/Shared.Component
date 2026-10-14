import type { CSSProperties, ComponentType, ReactNode, MouseEvent } from 'react'
export interface GridColumn<T> {
  key: string; label: string; width?: number; minWidth?: number; maxWidth?: number;
  dataType?: 'text' | 'number' | 'datetime' | 'boolean' | 'enum';
  options?: Array<string | number | { value: string | number; label: string }>;
  hidden?: boolean; sortable?: boolean; filterable?: boolean; exportable?: boolean;
  sticky?: 'right'; className?: string; max?: number;
  render?: (row: T, displayIndex: number) => ReactNode;
  value?: (row: T, originalIndex: number) => unknown;
  filterValue?: (row: T, originalIndex: number) => unknown;
  sortValue?: (row: T, originalIndex: number) => unknown;
}
export interface RowAction { id?: string; label: string; icon?: ComponentType<{ size?: number }>; hidden?: boolean; disabled?: boolean; danger?: boolean; run: () => unknown }
export interface RowActionContext<T> { keys: Set<string>; selectedRows: T[]; copyAllRows: () => Promise<number> }
export interface ExportPayload<T> { title: string; rows: T[]; columns: Array<{ key: string; label: string }> }
export interface GridServices<T> { copyText?: (text: string) => unknown | Promise<unknown>; exportRows?: (payload: ExportPayload<T>) => unknown | Promise<unknown> }
export interface YuntuGridProps<T extends Record<string, any>> {
  gridId: string; columns: GridColumn<T>[]; rows: T[]; rowKey?: keyof T & string;
  emptyText?: string; className?: string; style?: CSSProperties; active?: boolean;
  onRowClick?: (row: T, event: MouseEvent, displayIndex: number, context: { displayRows: T[]; originalIndex: number }) => void;
  rowActions?: RowAction[] | ((row: T, context: RowActionContext<T>) => RowAction[]);
  selected?: string | number; selectedKeys?: Set<string | number>;
  onSelectionChange?: (keys: Set<string>) => void;
  selectionDisabled?: boolean; selectionColumn?: boolean; filterEnabled?: boolean;
  rowRenderBatch?: number;
  exportConfig?: { title?: string; columns?: Array<{ key: string; label: string }> };
  clearConfig?: { disabled?: boolean; description?: string; onClear: () => unknown | Promise<unknown> };
  services?: GridServices<T>;
}
export function YuntuGrid<T extends Record<string, any>>(props: YuntuGridProps<T>): ReactNode
export default YuntuGrid
export const browserServices: Required<GridServices<Record<string, unknown>>>
export function rowsToCsv(rows: Record<string, unknown>[], columns: Array<{ key: string; label: string }>): string
export function gridRowActions<T>(actions: YuntuGridProps<Record<string, any>>['rowActions'], row: T, context: RowActionContext<T>): RowAction[]
export function runGridRowAction(action?: RowAction): unknown
export const GRID_OPERATORS: Readonly<Record<string, Array<[string, string]>>>
export function applyGridFilters<T>(rows: T[], columns: GridColumn<T>[], filters: Array<{ columnKey: string; operator: string; value?: string; valueTo?: string }>): Array<{ row: T; originalIndex: number }>
export function sortGridRows<T>(rows: Array<{ row: T; originalIndex: number }>, columns: GridColumn<T>[], sort: { key: string; direction: 'asc' | 'desc' }): Array<{ row: T; originalIndex: number }>
