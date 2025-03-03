// Provides a pagination bar for TanStack-based tables, an instance of which is
// required via the 'table' property.
//
import React from 'react';
import { Table } from '@tanstack/react-table';

interface PaginatorProps {
  table: Table<any>;
}

export const Paginator: React.FC<PaginatorProps> = ({ table }) => {
  return (
    <nav className="pagination">
      <div>
        <button
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
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
    </nav>
  );
};
