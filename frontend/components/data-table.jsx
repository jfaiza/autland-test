import { useCallback, useEffect, useState } from "react";
import { throttle } from 'lodash';
import {
  flexRender,
  getFilteredRowModel,
  getSortedRowModel,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioItem,
  DropdownMenuRadioGroup,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "@/components/data-table-pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PauseCircle } from "lucide-react";
import { getValidatorDetail } from "@/app/api/validators/route";
import { useChainStore } from "@/store";
import useDebouncedSearch from './useDebouncedSearch.jsx';

export function DataTable({ columns, data }) {
  const { selectedChain, setSelectedChain } = useChainStore();
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [isMobileView, setIsMobileView] = useState(false);
  const [selectedStates, setSelectedStates] = useState([
    "ACTIVE",
    "PAUSED",
    "JAILED",
    "JAILBOUND",
  ]);
  const [slashedFilter, setSlashedFilter] = useState("ALL");
  const [filteredData, setFilteredData] = useState(data);
  const [searchInput, setSearchInput] = useState("");
  const [collapsedRows, setCollapsedRows] = useState({});
  const [rowData, setRowData] = useState([]);

  const handleCollapse = async (rowId, node_address) => {
    setCollapsedRows((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
    if (!collapsedRows[rowId]) {
      try {
        const data = (await getValidatorDetail(selectedChain, node_address))
          .bonded_stake_history;
        setRowData((prev) => ({
          ...prev,
          [rowId]: data,
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  const table = useReactTable({
    data: filteredData,
    columns: columns({ collapsedRows, rowData }),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    defaultColumn: {
      size: 100, //starting column size
      minSize: 50, //enforced during column resizing
      maxSize: 500, //enforced during column resizing
    },
    initialState: {
      pagination: {
        pageSize: 100,
      },
    },
  });

  const states = [
    { value: "ACTIVE", label: "Active", color: "bg-green-500" },
    { value: "PAUSED", label: "Paused", color: "bg-black-700" },
    { value: "JAILED", label: "Jailed", color: "bg-orange-500" },
    { value: "JAILBOUND", label: "Jailbound", color: "bg-red-900" },
  ];

  const slashedOptions = [
    { value: "ALL", label: "View All" },
    { value: "SLASHED", label: "Slashed" },
    { value: "NOT_SLASHED", label: "Not Slashed" },
  ];

  const handleStateChange = (state) => {
    setSelectedStates((prev) =>
      prev.includes(state) ? prev.filter((s) => s !== state) : [...prev, state]
    );
  };

  const handleSlashedChange = (value) => {
    setSlashedFilter(value);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 700);
    };
    const timeoutId = setTimeout(() => {
      debouncedSearch(searchInput);
    }, 300);
    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    }
  }, [data, selectedStates, slashedFilter,data.jail_release_block]);

  const { debouncedSearch } = useDebouncedSearch(data, selectedStates, slashedFilter, setFilteredData);

  const handleSearchChange = (event) => {
    setSearchInput(event.target.value);
    debouncedSearch(event.target.value);
  };

  return(
    <>
      <div className="flex items-center py-4 bg-slate-100 dark:bg-slate-900">
        <Input
          placeholder="Filter by validator, treasury, Block..."
          value={searchInput}
          onChange={handleSearchChange}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Slashed
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuRadioGroup
              value={slashedFilter}
              onValueChange={handleSlashedChange}
            >
              {slashedOptions.map((option) => (
                <DropdownMenuRadioItem key={option.value} value={option.value}>
                  {option.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        &nbsp;&nbsp;
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="outline" className="ml-auto">
              State
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {states.map((state) => (
              <DropdownMenuCheckboxItem
                key={state.value}
                className="capitalize"
                checked={selectedStates.includes(state.value)}
                onCheckedChange={() => handleStateChange(state.value)}
              >
                <div
                  className={`h-3 w-3 rounded-full my-1 mr-2 ${state.color}`}
                >
                  {state.value === "PAUSED" && (
                    <PauseCircle className="h-3 w-3 mr-2 stroke-gray-500" />
                  )}
                </div>
                {state.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {/* &nbsp;&nbsp;
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id
                    .replace("id", "N")
                    .replace("node_address", "validators")
                    .replace("_", " ")}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu> */}
      </div>
      <div className="rounded-md border mb-1">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hidden md:table-row">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                // <Collapsible key={row.id} asChild>
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="block md:table-row mb-4 border rounded md:rounded-none p-4 md:p-0"
                  >
                    {isMobileView
                      ? row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            className="block lg:table-cell"
                            data-label={cell.column.id}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))
                      : row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            className="block lg:table-cell p-0"
                            data-label={cell.column.id}
                          >
                            {/* <CollapsibleTrigger
                              className="w-full h-full m-0"
                              onClick={() =>
                                handleCollapse(
                                  cell.row.id,
                                  cell.row.original.node_address
                                )
                              }
                            > */}
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            {/* </CollapsibleTrigger> */}
                          </TableCell>
                        ))}
                  </TableRow>
                // </Collapsible>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </>
  );
}
