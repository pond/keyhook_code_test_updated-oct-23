// TanStack's "meta" on column definitions is supposed to support arbitrary
// key-value pairs, but the TypeScript compiler is obviously having none of
// that! We must sadly then use declaration merging, which is a grubby and
// maintenance-heavy workaround, but at least it's rigorous.
//
import '@tanstack/react-table'

declare module '@tanstack/table-core' {
  interface ColumnMeta<TData extends RowData, TValue> {

    thClasses?: string, // Used by e.g. the List component
    tdClasses?: string, //  "

  }
}
