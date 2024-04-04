import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnglesRight,
  faAngleRight,
  faAngleLeft,
  faAnglesLeft,
} from "@fortawesome/free-solid-svg-icons";

const styleLogo = "h-3 w-3";

export default function Pagination({ table }: { table: any }) {
  const buttonSyle = "border rounded p-0.5";

  return (
    <>
      <div className="">
        {/* Pagination */}
        <div className="h-2" />
        <div className={"px-1"}>
          {table.getRowModel().rows.length} Rows of Total{" "}
          {table.getFilteredRowModel().rows.length}
        </div>
        <div className={"flex items-center gap-1 text-sm"}>
          <button
            className={buttonSyle}
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <FontAwesomeIcon icon={faAnglesLeft} className={styleLogo} />
          </button>
          <button
            className={buttonSyle}
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <FontAwesomeIcon icon={faAngleLeft} className={styleLogo} />
          </button>
          <button
            className={buttonSyle}
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <FontAwesomeIcon icon={faAngleRight} className={styleLogo} />
          </button>
          <button
            className={buttonSyle}
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <FontAwesomeIcon icon={faAnglesRight} className={styleLogo} />
          </button>
          <span className="flex items-center gap-1">
            <div>Page</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </strong>
          </span>
          <span className="flex items-center gap-1">
            | Go to page:
            <input
              type="number"
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              className="border p-1 rounded w-12"
            />
          </span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[10, 15, 20, 30, 50, 100].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
          {/* {dataQuery.isFetching ? "Loading..." : null} */}
        </div>
        {/* Pagination End*/}
      </div>
    </>
  );
}
