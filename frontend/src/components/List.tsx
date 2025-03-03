// Provides a table of Spraypaint-fetched resources via TanStack using table
// column definitions you provide, with a result that is sortable, paginated,
// searchable and includes user feedback while waiting for server responses.
// The search always sends an equals-"search_filter" query off to the server,
// so resources that are going to be viewed by this list must implement such.
//
// Column definitions can include meta 'thClasses' to append the given String
// to the list of HTML classes on TH elements and 'tdClasses' likewise for TD.
// By default the accessor key is also used as a sort field.
//
// The search placeholder is just "Search..." by default but can be overridden
// with column index 0's 'meta' via a "searchPlaceholder" property - this is
// ugly but pragmatic!
//
// While data is loading, list tables "fade" themselves via opacity, but only
// after a short delay and with a slow transition to avoid flicker with fast
// server responses. A spinner is shown for good measure, with a similar delay.
//
interface ListProps<C, S> {
  listColumns:     new () => C; // Column definitions for TanStack's table
  spraypaintModel: new () => S; // The Spraypaint class used for API calls etc.
}

import React, { useState, useEffect } from 'react';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import { useDebounce } from 'use-debounce';
import { Spinner } from './Spinner';
import { Paginator } from './Paginator';

export function List<C, S>({ listColumns, spraypaintModel }: ListProps<C, S>) {

  // ===========================================================================
  // Dynamic state
  // ===========================================================================

  const [data,       setData      ] = useState<S[]            >( [] );
  const [dataCount,  setDataCount ] = useState<number | null  >( null );
  const [isLoading,  setIsLoading ] = useState<boolean        >( true );
  const [error,      setError     ] = useState<string | null  >( null );

  const [pagination, setPagination] = useState( {pageIndex: 0, pageSize: 10} );
  const [sorting,    setSorting   ] = useState( [{id: listColumns[0].accessorKey, desc: false}] );
  const [filtering,  setFiltering ] = useState( {} );

  const [debouncedFiltering] = useDebounce(filtering, 250);

  // ===========================================================================
  // Functions
  // ===========================================================================

  const fetchItems = async () => {
    try {
      setIsLoading(true);

      const sortField = sorting[0]?.id;
      const sortOrder = sorting[0]?.desc ? 'desc' : 'asc';
      const sortOpts  = {};

      sortOpts[sortField] = sortOrder;

      var query = spraypaintModel
        .order(sortOpts)
        .per(pagination.pageSize)
        .page(pagination.pageIndex + 1)
        .stats({ total: "count" });

      if (debouncedFiltering) {
        query = query.where({simple_filter: debouncedFiltering});
      }

      const response = await query.all();

      setIsLoading(false);
      setDataCount(response.meta?.stats?.total?.count);
      setData(response.data);

    } catch (err) {

      setError(`Could not fetch information: ${err}`);
      setIsLoading(false);
    }
  };

  const getSortClass = (header: Header<TData>) => {
    const sortType = header.column.getIsSorted();

    if (sortType === false) {
      return 'th-sort-none';
    } else if (sortType === 'desc') {
      return 'th-sort-desc';
    } else {
      return 'th-sort-asc';
    }
  };

  // ===========================================================================
  // Initialisation
  // ===========================================================================

  const table = useReactTable({
    data:                 data,
    columns:              listColumns,
    getCoreRowModel:      getCoreRowModel(),

    manualPagination:     true,
    onPaginationChange:   setPagination,
    rowCount:             dataCount,
    pageSize:             10,

    manualSorting:        true,
    enableSortingRemoval: false,
    onSortingChange:      setSorting,

    manualFiltering:      true,
    onGlobalFilterChange: setFiltering,

    state: {
      pagination:      pagination,
      sorting:         sorting,
      globalFiltering: filtering
    },
  });

  useEffect(() => {
    fetchItems();
  }, [pagination, sorting, debouncedFiltering]);

  // ===========================================================================
  // Rendering
  // ===========================================================================

  if (error) {
    return (
      <div className="text-red-500 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-baseline">
        <h1 className="capitalize">
          {spraypaintModel.jsonapiType}
        </h1>
        <div className="ms-0 sm:ms-auto flex flex-row-reverse sm:flex-row gap-4 items-center">
          <Spinner active={isLoading} delayedShow={true} />
          <input
            className="text-md px-2 py-1"
            onChange={event => table.setGlobalFilter(String(event.target.value))}
            placeholder={listColumns[0].meta?.searchPlaceholder || 'Search...'}
          />
        </div>
      </div>

      <table className={`list-table ${isLoading ? 'transition delay-100 duration-500 opacity-50' : ''}`}>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr className="list-tr" key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className={`list-th ${getSortClass(header)} ${header.column.columnDef.meta?.thClasses}`}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr className="list-tr" key={row.id}>
              {row.getVisibleCells().map(cell => {
                return (
                  <td key={cell.id} className={`list-td ${cell.column.columnDef.meta?.tdClasses}`}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <Paginator table={table} />
    </div>
  );
}
