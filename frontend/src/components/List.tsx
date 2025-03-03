// Provides a table of Spraypaint-fetched resources via TanStack using table
// column definitions you provide, with a result that is sortable, paginated,
// searchable and includes user feedback while waiting for server responses.
// Searching is enacted via FilterAbilities and providing an array of zero or
// more filter components, which are positioned alongside the main title.
//
// Column definitions can include meta 'thClasses' to append the given String
// to the list of HTML classes on TH elements and 'tdClasses' likewise for TD.
// By default the accessor key is also used as a sort field.
//
// While data is loading, list tables "fade" themselves via opacity, but only
// after a short delay and with a slow transition to avoid flicker with fast
// server responses. A spinner is shown for good measure, with a similar delay.
//
import React, { useState, useEffect } from 'react';

import { ApplicationRecord } from '../Models';
import { FilterAbilities   } from '../classes/FilterAbilities';
import { Spinner           } from './Spinner';
import { Paginator         } from './Paginator';

import {
  AccessorKeyColumnDef,
  Header,
  SortingState,

  useReactTable,
  getCoreRowModel,
  flexRender
} from '@tanstack/react-table';


interface ListProps {
  listColumns:     AccessorKeyColumnDef<any, any>[]; // Column definitions for TanStack's table
  spraypaintModel: typeof ApplicationRecord;         // The Spraypaint class used for API calls etc.
  filterAbilities: FilterAbilities;                  // See class for details
}

export const List: React.FC<ListProps> = ({
  listColumns,
  spraypaintModel,
  filterAbilities
}) => {

  // ===========================================================================
  // Dynamic state
  // ===========================================================================

  const [isLoading,  setIsLoading     ] = useState<boolean                   >( true      );
  const [data,       setData          ] = useState<typeof ApplicationRecord[]>( []        );
  const [dataCount,  setDataCount     ] = useState<number | undefined        >( undefined );
  const [error,      setError         ] = useState<string | null             >( null      );

  const [pagination,    setPagination   ] = useState              ( {pageIndex: 0, pageSize: 10} );
  const [sorting,       setSorting      ] = useState<SortingState>( [{id: listColumns[0].accessorKey.toString(), desc: false}] );
  const [filters,       setFilters      ] = useState<any[]       >( [] );

  // ===========================================================================
  // Functions
  // ===========================================================================

  const fetchItems = async () => {
    try {
      setIsLoading(true);

      const sortOrder    = sorting[0]?.desc ? 'desc' : 'asc';
      const sortField    = sorting[0]?.id;
      const sortOpts:any = {};

      sortOpts[sortField] = sortOrder;

      var query = spraypaintModel
        .order(sortOpts)
        .per(pagination.pageSize)
        .page(pagination.pageIndex + 1)
        .stats({ total: "count" });

      filters.map((filterData) => {
        query = query.where(filterData);
      });

      const response = await query.all();

      setIsLoading(false);
      setDataCount(response.meta?.stats?.total?.count);
      setData(response.data as []);

    } catch (err) {
      setError(`Could not fetch information: ${err}`);
      setIsLoading(false);
    }
  };

  const getSortClass = (header: Header<any, any>) => {
    const sortType = header.column.getIsSorted();

    if (sortType === false) {
      return 'th-sort-none';
    } else if (sortType === 'desc') {
      return 'th-sort-desc';
    } else {
      return 'th-sort-asc';
    }
  };

  const filtersDidChange = (index: number, filterData: any) => {
    const newFilters = [...filters];
    newFilters[index] = filterData;
    setFilters(newFilters);

    const newPagination = {pageIndex: 0, pageSize: pagination.pageSize};
    setPagination(newPagination);
  };

  // ===========================================================================
  // Initialisation
  // ===========================================================================

  // TanStack's documentation and internal commentary are wrong due to a bug in
  // PaginationOptions, which fails to declare the "pageSize" property leading
  // to TypeScript compilation failure. It defaults to 10, so we live with it.
  //
  const table = useReactTable({
    data:                 data,
    columns:              listColumns,
    getCoreRowModel:      getCoreRowModel(),

    manualPagination:     true,
    onPaginationChange:   setPagination,
    rowCount:             dataCount,
    // pageSize: ...,

    manualSorting:        true,
    enableSortingRemoval: false,
    onSortingChange:      setSorting,

    manualFiltering:      true,

    state: {
      pagination: pagination,
      sorting:    sorting
    },
  });

  useEffect(() => {
    fetchItems();
  }, [pagination, sorting, filters]);

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
      <div className="list-title-and-filters mb-6 flex flex-wrap gap-4 items-center">
        <h1 className="capitalize grow">
          {spraypaintModel.jsonapiType}
        </h1>

        <Spinner active={isLoading} delayedShow={true} />

        <div className="flex flex-row flex-wrap gap-4 items-center">
          {filterAbilities.filterComponents?.map((Component, index) => (
            <Component
              key={index}
              onChange={function(filterData: any) { filtersDidChange(index, filterData) }}
            />
          ))}
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
