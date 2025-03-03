// Provides a pagination bar for TanStack-based tables, an instance of which is
// required via the 'table' property.
//
// If optional children are provided, they're rendered after the "Page X of Y"
// indicator, *inside* the HTML <nav> element, just before it closes.
//
import React from 'react';
import { Table } from '@tanstack/react-table';

interface PaginatorProps extends React.PropsWithChildren {
  table:     Table<any>;
  children?: React.ReactElement
}

export const Paginator: React.FC<PaginatorProps> = ({ table, children }) => {
  return (
    <nav className="pagination">
      <div>
        <button
          className="page-navigation"
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          className="page-navigation"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          className="page-navigation"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          className="page-navigation"
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
      </div>
      <select
        value={table.getState().pagination.pageSize}
        onChange={event => { table.setPageSize(Number(event.target.value)) }}
      >
        {[10, 25, 50].map(pageSize => (
          <option key={pageSize} value={pageSize}>
            {pageSize}
          </option>
        ))}
      </select>
      <span>
        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
      </span>
      {children}
    </nav>
  );
};
