import {
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  FilterFn,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  ColumnFiltersState,
} from "@tanstack/react-table";
import Pagination from "./Pagination";
import React from "react";
import { RankingInfo, rankItem } from "@tanstack/match-sorter-utils";

import DebouncedInput from "./DebouncedInput";
import Filter from "./Filter";

declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);
  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

export default function ReactTable({
  data,
  columns,
}: {
  data: any;
  columns: any;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const table = useReactTable({
    data,
    columns,
    initialState: {
      pagination: {
        pageSize: 30,
      },
    },
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      columnFilters,
      sorting,
      globalFilter,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    debugTable: false,
    debugHeaders: false,
    debugColumns: false,
  });
  if (!Array.isArray(data)) {
    return <div>The data is not an Array</div>;
  }
  const cols = Object.keys(data[0]);
  cols.push("Actions");

  // const firstPropName = cols[0];

  //================================================================

  const layout = "px-2 py border-l border-slate-200 dark:border-gray-700";
  const style = "bg-white border-b dark:bg-gray-900 dark:border-gray-700";

  const theadStyle =
    "bg-gray-100 dark:bg-gray-700 text-xs text-gray-700 uppercase dark:text-gray-400";
  const tfootStyle = theadStyle;

  return (
    <>
      <div className="relative">
        <div className="mb-2">
          <DebouncedInput
            value={globalFilter ?? ""}
            onChange={(value) => setGlobalFilter(String(value))}
            className="p-1 font-lg rounded border border-block"
            placeholder="Suche alle Spalten..."
          />
        </div>
        <div className="overflow-x-auto rounded-lg">
          <table className="w-full text-sm text-left border rounded border-collapse">
            <thead className={theadStyle + " border-b-4 border-b-gray-300"}>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      scope="col"
                      className={
                        layout + " " + "py-2 border-b-2 dark:border-gray-500"
                      }
                      colSpan={header.colSpan}
                    >
                      {header.isPlaceholder ? null : (
                        <>
                          <div
                            {...{
                              className: header.column.getCanSort()
                                ? "cursor-pointer select-none"
                                : "",
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: " 🔼",
                              desc: " 🔽",
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                          {header.column.getCanFilter() ? (
                            <div>
                              <Filter column={header.column} table={table} />
                            </div>
                          ) : null}
                        </>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="[&>*:nth-child(even)]:bg-gray-50 dark:[&>*:nth-child(even)]:bg-gray-600">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className={style}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className={layout}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot className={tfootStyle + " border-t-2 border-t-gray-300"}>
              {table.getFooterGroups().map((footerGroup) => (
                <tr key={footerGroup.id}>
                  {footerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={layout + " py-2"}
                      colSpan={header.colSpan}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.footer,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </tfoot>
          </table>
        </div>
        <Pagination table={table} />
        <pre>{sorting.length !== 0 && JSON.stringify(sorting, null, 2)}</pre>
      </div>
    </>
  );
}
