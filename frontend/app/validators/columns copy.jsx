"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronUp,
  ArrowRight,
  ChevronDown,
  HardDrive,
  ChevronsUpDown,
  PauseCircle,
} from "lucide-react";
import { UpRightSquare, Pickaxe } from "@/components/svg";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  AlertDialogOverlay,
  AlertDialogPortal,
} from "@radix-ui/react-alert-dialog";

// useRouter
import { useRouter } from "next/navigation";
import {
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import CopyComponent from "@/components/ui/copy";
import Hover from "@/components/ui/showShield";
import HoverCommitee from "@/components/ui/showCommitee";
import General from "../../components/Cards/General";
import { Badge } from "@/components/ui/badge";
import { BackgroundVariant } from "reactflow";
function numberWithSpaces(x) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return parts.join(".");
}

//to push code
export const columns = ({ collapsedRows, rowData }) => [
  {
    accessorKey: "id",
    header: ({ column }) => <div className="text-center">N</div>,
    cell: ({ row }) => {
      return (
        <>
          {window.innerWidth >= 767 && (
            <div className="w-full">
              <div className="mt-9 mb-12 ml-0">{row.original.id}</div>
              <CollapsibleContent asChild>
                <div className="h-40 mt-12 w-full bg-slate-200 dark:bg-slate-900  m-0 p-0"></div>
              </CollapsibleContent>
            </div>
          )}
        </>
      );
    },
  },
  {
    accessorKey: "node_address",
    header: "Validators",
    cell: ({ row }) => {
      const states = {
        ACTIVE: "bg-green-500",
        PAUSED: "bg-black-700",
        JAILED: "bg-orange-500",
        JAILBOUND: "bg-red-500",
      };
      const commiteeMemberColor =
        parseFloat(row.original.voting_power) > 0 ? "31D0AA" : "a9a9a949";
      const router = useRouter();
      const handleDialogTriggerClick = (e) => {
        e.stopPropagation();
      };
      return (
        <div>
          <div className="w-fit font-medium mt-3">
            <div className="font-semibold flex gap-4 relative">
              <Button
                className={
                  "top-0 relative border-none pointer-events-none dark:bg-slate-800"
                }
                variant="outline"
                size="icon"
                key={row.original.validator_name}
              >
                {row.original.image ? (
                  <img
                    src={row.original.image}
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <HardDrive></HardDrive>
                )}
                <div
                  className={`absolute top-0 right-1 h-3 w-3 rounded-full my-1 ${
                    states[row.original.state]
                  }`}
                >
                  {row.original.state === "PAUSED" && (
                    <PauseCircle className="absolute top-0 right-0 h-3 w-3 stroke-gray-500" />
                  )}
                </div>
              </Button>
              <div className="flex flex-col mt-1 text-lg dark:text-white">
                <a href={`/validators/${row.original.node_address}`}>
                  <span className="row flex justify-between w-64">
                    {"Validator#"}
                    {row.original.validator_name === "unknown"
                      ? `Block: ${row.original.registration_block}`
                      : row.original.validator_name}
                    <div className="relative flex gap-4">
                      {row.original.registration_block === "0" && (
                        <Badge
                          color="info"
                          className="font-semibold px-1 h-5 border-spacing-1 absolute top-[0.21rem] right-7"
                          variant="outline"
                        >
                          Genesis
                        </Badge>
                      )}
                      <HoverCommitee
                        commiteeMemberColor={commiteeMemberColor}
                      />
                    </div>
                  </span>
                </a>
                {/* <div className="inline-flex items-center border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-warning border-transparent bg-opacity-10 text-warning hover:text-warning text-[10px] px-1 py-0 rounded leading-4 capitalize">Genesis</div> */}
              </div>
            </div>
            <div className="row">
              <div className="font-medium md:ml-16">
                <div className="row  flex justify-between">
                  <div className="font-bold text-sm ">Node: </div>
                  <div className="ml-0">
                    <CopyComponent address={row.original.node_address} />
                  </div>
                </div>
                <div className="flex justify-between mb-3">
                  <div className="text-sm font-semibold">Treasury:</div>
                  <div className="ml-0">
                    <CopyComponent address={row.original.treasury} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {window.innerWidth >= 767 && (
            <CollapsibleContent >
              <div className="relative h-40 mt-3 w-full text-xs bg-slate-200 dark:bg-slate-900">
                <p className="absolute pt-8 pb-4 ml-16 mb-4">
                  <span className="">Created At:</span>
                  <span className="dark:text-white">
                    {" "}
                    Block#{row.original.registration_block}
                  </span>{" "}
                </p>
                <p className="absolute pt-12 pb-4 ml-32">
                  ({new Date(row.createdAt).toLocaleDateString()})
                </p>
                <div className="ml-12 flex">
                  <button
                    className="mt-28 border-none py-1 px-4 ml-0"
                    onClick={() => {
                      router.push(`/validators/${row.original.node_address}`, {
                        scroll: false,
                      });
                    }}
                  >
                    <p className="flex justify-between font-bold text-cyan-400">
                      <div className="mr-1">See More Details</div>
                      <div className="mt-[1.45px]">
                        <UpRightSquare />
                      </div>
                    </p>
                  </button>
                  <AlertDialog >
                    <AlertDialogTrigger asChild>
                      <Button 
                        className="mt-28  bg-cyan-600 text-white px-2 rounded-[0.5rem] h-8 flex justify-between"
                        style={{ background: "#2C8EB8" }}
                        onClick={handleDialogTriggerClick}
                      >
                        <p className="ml-2">Stake</p>
                        <ArrowRight className="h-5 black dark:white dark:stroke-lime-50" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogPortal>
                      <AlertDialogOverlay className="data-[state=open]:animate-overlayShow fixed inset-0" />
                      <AlertDialogContent className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[300px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] p-[9px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
                        <AlertDialogDescription className="text-success font-bold mt-4 mb-5 text-[15px] leading-normal flex justify-center">
                          Upcoming feature!
                        </AlertDialogDescription>
                        <div className="flex justify-center gap-[25px]">
                          <AlertDialogCancel asChild>
                            <button className="bg-warning border-spacing-1 font-bold text-primary-200 hover:text-primary-700 text-mauve11 hover:bg-mauve5 focus:shadow-mauve7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px]  leading-none outline-none focus:shadow-[0_0_0_2px]">
                              Ok
                            </button>
                          </AlertDialogCancel>
                        </div>
                      </AlertDialogContent>
                    </AlertDialogPortal>
                  </AlertDialog>
                </div>
              </div>
            </CollapsibleContent>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "bonded_stake",
    header: ({ column }) => (
      <Button
        className="ml-1"
        key={column.id}
        variant="ghost"
        onClick={() => {
          if (column.getIsSorted() === "desc") {
            column.toggleSorting(false);
          } else if (
            column.getIsSorted() === "asc" ||
            column.getIsSorted() === false
          ) {
            column.toggleSorting("desc");
          }
        }}
      >
        Staked
        {column.getIsSorted() === "desc" && (
          <ChevronDown className="ml-1 h-4 w-3" />
        )}
        {column.getIsSorted() === "asc" && (
          <ChevronUp className="ml-1 h-4 w-3" />
        )}
        {column.getIsSorted() === false && (
          <ChevronsUpDown className="ml-1 h-4 w-3" />
        )}
      </Button>
    ),
    cell: ({ row }) => {
      const stake = parseFloat(row.getValue("bonded_stake")).toFixed(2);
      const selfstake = parseFloat(row.original.self_bonded_stake).toFixed(2);
      const delegators = parseFloat(stake - selfstake).toFixed(2);
      return (
        <>
          {window.innerWidth < 767 && (
            <>
              <div className="flex justify-between w-72 ">
                <h1 className="font-bold text-base">Stacked: </h1>
              </div>
              <br />
            </>
          )}
          <div className="mr-3 mt-6 p-0 mb-6 w-[200px] ">
            <div className="text-left font-light flex justify-between dark:text-white">
              <div className="font-bold text-sm">
                <div className="flex">
                  <div className="-mt-[2px] mr-1">Total:</div>
                  <Hover
                    covered={row.original.covered}
                    slashed={numberWithSpaces(stake * 0.25)}
                  ></Hover>
                </div>
              </div>
              {numberWithSpaces(stake)} NTN
            </div>
            <div className=" font-extralight text-xs flex justify-between">
              <div className="font-normal text-xs">
                &nbsp; &nbsp;&nbsp;Self bonded:{" "}
              </div>
              {numberWithSpaces(selfstake)} NTN
            </div>
            <div className="font-extralight text-xs flex justify-between">
              <div className="font-normal text-xs">
                &nbsp; &nbsp;&nbsp;Delegated:{" "}
              </div>
              {numberWithSpaces(delegators)} NTN
            </div>
          </div>
          {window.innerWidth >= 767 && (
            <CollapsibleContent asChild>
              <div className="h-40 dark:bg-slate-900 p-0 -mt-[0.5px]">
                <General chartData={rowData[row.index]} />
              </div>
            </CollapsibleContent>
          )}
        </>
      );
    },
  },
  {
    accessorKey: "commission_rate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => {
            if (column.getIsSorted() === "desc") {
              column.toggleSorting(false);
            } else if (
              column.getIsSorted() === "asc" ||
              column.getIsSorted() === false
            ) {
              column.toggleSorting("desc");
            }
          }}
        >
          CR
          {column.getIsSorted() === "desc" && (
            <ChevronDown className="ml-1 h-4 w-4" />
          )}
          {column.getIsSorted() === "asc" && (
            <ChevronUp className="ml-1 h-4 w-3" />
          )}
          {column.getIsSorted() === false && (
            <ChevronsUpDown className="ml-1 h-4 w-3" />
          )}
        </Button>
      );
    },

    cell: ({ row }) => {
      const rate = row.getValue("commission_rate");
      return (
        <div className="w-18 font-medium">
          {window.innerWidth < 767 && (
            <div className="flex justify-between w-72">
              <h1 className="font-bold text-base">Commission Rate: </h1>
              <div className="text-base">{rate} % </div>
            </div>
          )}
          {window.innerWidth >= 767 && (
            <>
              <div className="text-start ml-8 mt-9 mb-12 font-light dark:text-white">
                {rate} %
              </div>
              <CollapsibleContent asChild>
                <div className="mt-12 h-40 w-full bg-slate-200 dark:bg-slate-900"></div>
              </CollapsibleContent>
            </>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "voting_power",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => {
            if (column.getIsSorted() === "desc") {
              column.toggleSorting(false);
            } else if (
              column.getIsSorted() === "asc" ||
              column.getIsSorted() === false
            ) {
              column.toggleSorting("desc");
            }
          }}
        >
          VP
          {column.getIsSorted() === "desc" && (
            <ChevronDown className="ml-1 h-4 w-3" />
          )}
          {column.getIsSorted() === "asc" && (
            <ChevronUp className="ml-1 h-4 w-3" />
          )}
          {column.getIsSorted() === false && (
            <ChevronsUpDown className="ml-1 h-4 w-3" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const power = parseFloat(row.getValue("voting_power"));
      return (
        <div className="w-18 text-left font-medium">
          {window.innerWidth < 767 && (
            <div className="flex justify-between w-72">
              <h1 className="font-bold text-base">Voting Power: </h1>
              <div className="text-base">{power} % </div>
            </div>
          )}
          {window.innerWidth >= 767 && (
            <>
              <div className=" ml-6 mt-9 mb-12 font-light dark:text-white">
                {power.toFixed(2)} %
              </div>
              <CollapsibleContent asChild>
                <div className="p-0 mt-12  h-40 w-full bg-slate-200 dark:bg-slate-900"></div>
              </CollapsibleContent>
            </>
          )}
        </div>
      );
    },
    enableSorting: true,
    sortingFn: (rowA, rowB, columnId) => {
      const a = parseFloat(rowA.getValue(columnId));
      const b = parseFloat(rowB.getValue(columnId));
      return a > b ? 1 : a < b ? -1 : 0;
    },
  },
  {
    accessorKey: "total_slashed",
    enableResizing: false,

    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => {
            if (column.getIsSorted() === "desc") {
              column.toggleSorting(false);
            } else if (
              column.getIsSorted() === "asc" ||
              column.getIsSorted() === false
            ) {
              column.toggleSorting("desc");
            }
          }}
        >
          Slashed
          {column.getIsSorted() === "desc" && (
            <ChevronDown className="ml-1 h-4 w-3" />
          )}
          {column.getIsSorted() === "asc" && (
            <ChevronUp className="ml-1 h-4 w-3" />
          )}
          {column.getIsSorted() === false && (
            <ChevronsUpDown className="ml-1 h-4 w-3" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => {
      const slashed = Number(row.original.total_slashed).toFixed(2);
      return (
        <div className="">
          {window.innerWidth < 767 && (
            <div className="flex justify-between w-72">
              <h1 className="font-bold text-base">Slashed: </h1>
              <div className="text-base">{numberWithSpaces(slashed)} NTN</div>
            </div>
          )}
          {window.innerWidth >= 767 && (
            <>
              <div
                className={`w-28 mt-9 mb-12 text-right font-light dark:${
                  slashed !== "0.00" && "text-red-600"
                } dark:${slashed !== "0.00" && "font-semibold"}`}
              >
                {numberWithSpaces(slashed)} NTN
              </div>
              <CollapsibleContent asChild>
                <div className="h-40 mt-12 w-full bg-slate-200 dark:bg-slate-900"></div>
              </CollapsibleContent>
            </>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "collapsible arrow",
    header: "",
    cell: ({ row }) => {
      return (
        <div>
          {window.innerWidth >= 767 && (
            <>
              <div className="mt-7 mb-9">
                <Button variant="solid">
                  {collapsedRows[row.id] ? (
                    <ChevronUp className="h-5 w-5 black dark:white dark:stroke-lime-50" />
                  ) : (
                    <ChevronDown className="h-5 w-5 black dark:white dark:stroke-lime-50" />
                  )}
                </Button>
              </div>
              <CollapsibleContent asChild>
                <div className="h-40 mt- w-full bg-slate-200 dark:bg-slate-900"></div>
              </CollapsibleContent>
            </>
          )}
        </div>
      );
    },
  },
];
