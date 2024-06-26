import { Column, Table } from "@tanstack/react-table";
import React from "react";
import DebouncedInput from "./DebouncedInput";

export default function Filter({
  column,
  table,
}: {
  column: Column<any, unknown>;
  table: Table<any>;
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  // const sortedUniqueValues = React.useMemo(
  //   () =>
  //     typeof firstValue === "number"
  //       ? []
  //       : Array.from(column.getFacetedUniqueValues().keys()).sort(),
  //   [column.getFacetedUniqueValues()]
  // );
  const sortedUniqueValues = React.useMemo(() => {
    if (
      typeof firstValue === "number" ||
      !column ||
      !column.getFacetedUniqueValues()
    ) {
      return [];
    } else {
      return Array.from(column.getFacetedUniqueValues().keys()).sort();
    }
  }, [column, firstValue]);

  const filterStyle = "border shadow rounded p-1 mt-1";
  return typeof firstValue === "number" ? (
    <div>
      <div className="flex space-x-1">
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
          value={(columnFilterValue as [number, number])?.[0] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [value, old?.[1]])
          }
          placeholder={`Min ${
            column.getFacetedMinMaxValues()?.[0]
              ? `(${column.getFacetedMinMaxValues()?.[0]})`
              : ""
          }`}
          className={"w-12 " + filterStyle}
        />
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
          value={(columnFilterValue as [number, number])?.[1] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [old?.[0], value])
          }
          placeholder={`Max ${
            column.getFacetedMinMaxValues()?.[1]
              ? `(${column.getFacetedMinMaxValues()?.[1]})`
              : ""
          }`}
          className={"w-12 " + filterStyle}
        />
      </div>
      <div className="h-1" />
    </div>
  ) : (
    <>
      <datalist id={column.id + "list"}>
        {sortedUniqueValues.slice(0, 5000).map((value: any, key: any) => (
          <option value={value} key={key} />
        ))}
      </datalist>
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? "") as string}
        onChange={(value) => column.setFilterValue(value)}
        // placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
        placeholder={`Search...`}
        className={"w-24 " + filterStyle}
        list={column.id + "list"}
      />
      <div className="h-1" />
    </>
  );
}
