"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronUp,
  ChevronDown,
  HardDrive,
  ChevronsUpDown,
  PauseCircle,
} from "lucide-react";
import { config } from "@/config";
import { useSendTransaction } from "wagmi";
import SubmitFormInSheet from "./submitform-sheet";

// useRouter
import { useRouter } from "next/navigation";
import CopyComponent from "@/components/ui/copy";
import Hover from "@/components/ui/showShield";
import HoverCommitee from "@/components/ui/showCommitee";
import { Badge } from "@/components/ui/badge";
import { UpRightSquare } from "@/components/svg";
function numberWithSpaces(x) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return parts.join(".");
}

//to push code
export const columns = ({ collapsedRows, rowData }) => [
  {
    accessorKey: "id",
    header: ({ column }) => <div className="text-center">{"#"}</div>,
    cell: ({ row }) => {
      return (
        <>
          {window.innerWidth >= 767 && (
            <div className="w-full">
              <div className="flex justify-center items-start pb-5">
                {row.original.id}
              </div>
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
        <div className="flex items-start md:pb-5">
          <div className="sm:w-fit font-medium sm:mt-3 -mt-10">
            <div className="font-semibold flex gap-4 relative ml-0 pl-0">
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
                <a
                  href={`/validators/${row.original.node_address}?rank=${row.original.id}`}
                  className="hover:text-[#1fc7d4]"
                >
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
            <div className="row  max-w-[20rem]">
              <div className="font-medium sm:ml-16 ml-14">
                <div className="row  flex justify-between">
                  <div className="font-bold text-sm ">Node: </div>
                  <div className="ml-0">
                    <CopyComponent address={row.original.node_address} />
                  </div>
                </div>
                <div className="flex justify-between md:mb-3 ">
                  <div className="text-sm font-semibold">Treasury:</div>
                  <div className="ml-0">
                    <CopyComponent address={row.original.treasury} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "bonded_stake",
    header: ({ column }) => (
      <div className="flex justify-center items-center w-[200px]">
        <Button
          className="mr-[70px] ml-[170px]"
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
      </div>
    ),
    cell: ({ row }) => {
      const stake = parseFloat(row.getValue("bonded_stake")).toFixed(2);
      const selfstake = parseFloat(row.original.self_bonded_stake).toFixed(2);
      const delegators = parseFloat(stake - selfstake).toFixed(2);
      return (
        <>
          <div className="flex sm:w-72  pt-0">
            {window.innerWidth < 767 && (
              <h1 className="font-bold text-base ml-14 mb-2">Stacked: </h1>
            )}
          </div>
          <div className="sm:mr-3 md:mt-6 sm:ml-4 ml-5 p-0 md:mb-6 md:pb-5">
            <div className="sm:w-[200px] w-[242px] ml-12 sm:text-left font-light flex justify-between dark:text-white">
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
            <div className="sm:w-[200px] ml-12 font-extralight text-xs flex sm:justify-between justify-between">
              <div className="font-normal text-xs">
                &nbsp; &nbsp;&nbsp;Self bonded:{" "}
              </div>
              <div className="mr-[10px] md:mr-0">
                {numberWithSpaces(selfstake)} NTN
              </div>
            </div>
            <div className="sm:w-[200px]  ml-12  font-extralight text-xs flex sm:justify-between justify-between ">
              <div className="font-normal text-xs">
                &nbsp; &nbsp;&nbsp;Delegated:{" "}
              </div>
              <div className="mr-[10px] md:mr-0">
                {numberWithSpaces(delegators)} NTN
              </div>
            </div>
          </div>
        </>
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
        <div className="w-18 text-left font-medium md:pb-5">
          {window.innerWidth < 767 && (
            <div className="flex justify-between ml-14 h-[7px] md:h-[25px] max-w-[250px]">
              <h1 className="font-bold text-base">Voting Power: </h1>
              <div className="text-base">{power} % </div>
            </div>
          )}
          {window.innerWidth >= 767 && (
            <>
              <div className=" ml-6 mt-9 mb-12 font-light dark:text-white">
                {power.toFixed(2)} %
              </div>
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
          Commission
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
      const router = useRouter();
      return (
        <div className="w-18 font-medium md:pb-5">
          {window.innerWidth < 767 && (
            <div className="flex justify-between ml-14 h-[7px] md:h-[25px] max-w-[250px]">
              <h1 className="font-bold text-base">Commission Rate: </h1>
              <div className="text-base">{rate} % </div>
            </div>
          )}
          {window.innerWidth >= 767 && (
            <>
              <div className="text-start ml-14 mt-9 mb-12 font-light dark:text-white">
                {rate} %
              </div>
              <div className="ml-12 flex">
                <button
                  className="-mt-5 border-none md:-mb-1.5 lg:ml-4"
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
              </div>
            </>
          )}
        </div>
      );
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
      const { sendTransaction, isPending, isSuccess, error } =
        useSendTransaction({
          config,
        });
        const router = useRouter();

      return (
        <div className="">
          {window.innerWidth < 767 && (
            <div className="flex justify-between  h-[7px] md:h-[25px] max-w-[250px] ml-14">
              <h1 className="font-bold text-base">Slashed: </h1>
              <div className="text-base">{numberWithSpaces(slashed)} NTN</div>
            </div>
          )}
          {window.innerWidth >= 767 && (
            <div className="pb-0">
              <div
                className={`w-28 mt-8 mb-6 text-right font-light dark:${
                  slashed !== "0.00" && "text-red-600"
                } dark:${slashed !== "0.00" && "font-semibold"}`}
              >
                {numberWithSpaces(slashed)} NTN
              </div>
            </div>
          )}
          {window.innerWidth >= 767 && (
            <div className="flex justify-end w-28 ml-2 ">
              {/* <div className="flex items-end mr-10"> */}
              <SubmitFormInSheet
                validator={row.original}
                sendTransaction={sendTransaction}
                isPending={isPending}
                isSuccess={isSuccess}
                error={error}
              />
            </div>
          )}
          {window.innerWidth < 767 && (
            <div className="mt-10 pb-0 flex justify-between">
              {/* <div className="flex items-end mr-10"> */}
              <div>
              <div className="ml-12 pt-1.5">
                <button
                  className="border-none"
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
              </div>
              </div>
              <div>
                <SubmitFormInSheet
                  validator={row.original}
                  sendTransaction={sendTransaction}
                  isPending={isPending}
                  isSuccess={isSuccess}
                  error={error}
                />
              </div>
            </div>
          )}
        </div>
      );
    },
  },
];
