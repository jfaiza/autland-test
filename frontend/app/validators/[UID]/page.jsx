"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import { FaDiscord } from "react-icons/fa";
import { FaThreads, FaXTwitter, FaTelegram, FaLink } from "react-icons/fa6";
import { getValidator } from "@/app/api/validators/route";
import { Table } from "@/components/ui/table";
import { useChainStore } from "@/store";
import LayoutLoader from "@/components/layout-loader";
import CopyComponent from "@/components/ui/copy";
import { ArrowRight, PauseCircle } from "lucide-react";
import CustomizedLabelPie from "@/components/ui/customized-label-apex-pie";
import Hover from "@/components/ui/showShield";
import ReportChart from "@/components/ui/report-chart";
import HoverCommitee from "@/components/ui/showCommitee";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  AlertDialogOverlay,
  AlertDialogPortal,
} from "@radix-ui/react-alert-dialog";
import CopyToClipboardComponent from "@/components/copy-to-clipboard";
import SubmitFormInSheet from "../submitform-sheet";
import { config } from "@/config";
import { useSendTransaction } from "wagmi";

export default function Page() {
  const params = useParams();
  const searchParams = useSearchParams();
  const rank = searchParams.get("rank");
  const { sendTransaction, isPending, isSuccess, error } = useSendTransaction({
    config,
  });
  const { UID: address } = params;
  const { selectedChain } = useChainStore();
  const [validator, setValidator] = useState();
  const [loading, setLoading] = useState(true);
  const [slashed, setSlashed] = useState("");
  const [series, setSeries] = useState([]);
  const [rates, setRates] = useState([]);
  const [dates, setDates] = useState([]);
  const [commiteeMemberColor, setCommiteeMemberColor] = useState("a9a9a949");

  // const toast  = useToast()

  const state_color = {
    ACTIVE: "bg-green-500",
    PAUSED: "bg-black-700",
    JAILED: "bg-orange-500",
    JAILBOUND: "bg-red-500",
  };
  function numberWithSpaces(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return parts.join(".");
  }
  const convertDate = (date) => {
    const dateObject = new Date(date);

    // Extract year, month, and day for formatting
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, "0"); // Add leading zero for single-digit months
    const day = String(dateObject.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    getValidator(selectedChain, address).then((data) => {
      setValidator(data);
      setSlashed(Number(data.total_slashed).toFixed(2));
      setCommiteeMemberColor(
        parseFloat(data.voting_power) > 0 ? "31D0AA" : "a9a9a949"
      );
      setDates(
        Object.values(data.bonded_stake_history).map((value) =>
          convertDate(value.time)
        )
      );
      setSeries([
        {
          name: "Total Staked",
          data: Object.values(data.bonded_stake_history).map((value) =>
            parseInt(value.value)
          ),
        },
        {
          name: "Self Bonded",
          data: Object.values(data.self_bonded_stake_history).map((value) =>
            parseInt(value.value)
          ),
        },
        {
          name: "Delegated",
          data: Object.values(data.delegated_stake_history).map((value) =>
            parseInt(value.value)
          ),
        },
        {
          name: "Slashed",
          data: Object.values(data.total_slashed_history).map((value) =>
            parseInt(value.value)
          ),
        },
      ]);
      setRates([
        {
          name: "Commission Rate",
          data: Object.values(data.commission_rate_history).map((value) =>
            parseFloat(value.value).toFixed(2)
          ),
        },
        {
          name: "Voting Power",
          data: Object.values(data.voting_power_history).map((value) =>
            parseFloat(value.value).toFixed(2)
          ),
        },
      ]);
      setLoading(false);
    });
  }, []);
  if (loading) return <LayoutLoader />;
  return (
    <div className="layout-padding md:px-0 px-0 page-min-height">
      <div className="opacity: 1; transform: none;">
        <main className="">
          <div className="">
            {/* grid grid-cols-12 gap-6 pb-6 */}
            <div className="rounded-md bg-card text-card-foreground shadow-sm mb-6">
              <div className="flex space-y-1.5 px-4 py-4 mb-6 border-b border-border flex-row items-center">
                <h3 className="text-xl font-medium leading-none flex-1">
                    {"Validator#"}
                    {validator.validator_name === "unknown"
                      ? `Block: ${validator.registration_block}`
                      : validator.validator_name}
                </h3>
                <div className="flex-none flex items-center gap-3"></div>
              </div>
              <div className="p-6 pt-0 border-b border-default-200">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-none">
                    <div className="h-[148px] w-[148px] rounded">
                      <Image
                        className="w-full h-full object-cover rounded"
                        style={{ color: "transparent" }}
                        src="/images/autonity_validator_by_default_image.jpg"
                        width={148}
                        height={148}
                      />
                    </div>
                  </div>
                  <div className="flex-1  w-full md:w-[400px]">
                    <div className="flex flex-wrap justify-start items-center gap-4 w-[calc(100%-0.1rem)]">
                      <div className="text-xl font-medium text-default-950 truncate ">
                        {/* <div className="flex justify-between items-center w-full md:w-[400px]">
                      <div className="md:text-sm text-xs text-default-600 truncate w-[calc(100%-0.1rem)]"> */}
                        Node Address:{" "}
                        <span className="text-cyan-600 text-base">
                          {address}
                        </span>
                      </div>
                      <div className="pl-0 -ml-2 mt-0">
                        <CopyToClipboardComponent text={address} />
                      </div>
                      <div className="space-x-3 rtl:space-x-reverse mt-1  ">
                        {validator.registration_block === "0" && (
                          <div className="inline-flex  rounded-full border py-[0.1rem] px-[0.5rem]   text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-info border-transparent bg-opacity-10 text-info hover:text-info">
                            Genesis
                          </div>
                        )}
                        <HoverCommitee
                          commiteeMemberColor={commiteeMemberColor}
                          text="Commitee"
                          inDetails={true}
                        />
                      </div>
                      <div className="text-sm text-default-600 w-full -mt-2">
                        Description :
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-2 lg:gap-6">
                        <div className="border border-dashed border-default-300 rounded py-2.5 px-3 min-w-fit lg:min-w-[148px]">
                          <div className="text-sm font-medium text-default-500 capitalize">
                            Created at
                          </div>
                          <div className="text-sm font-medium text-default-900">
                            Block#{validator.registration_block}
                          </div>
                        </div>
                        <div className="border border-dashed border-default-300 rounded py-2.5 px-3 min-w-fit lg:min-w-[148px]">
                          <div className="text-sm font-medium text-default-500 capitalize">
                            State
                          </div>
                          <div className="text-sm font-medium text-default-900 capitalize">
                            <div className="flex justify-start">
                              <div
                                className={`h-2 w-2 rounded-full ${
                                  validator.state === "PAUSED"
                                    ? "mr-2 mt-1"
                                    : "mt-1.5 mr-1"
                                }  ${state_color[validator.state]}`}
                              >
                                {validator.state === "PAUSED" && (
                                  <PauseCircle className="h-3 w-3 stroke-gray-500" />
                                )}
                              </div>
                              <div className=" capitalize">
                                {validator.state.toLowerCase()}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="border border-dashed border-default-300 rounded py-2.5 px-3 min-w-fit lg:min-w-[148px]">
                          <div className="text-sm font-medium text-default-500 capitalize">
                            Voting Power
                          </div>
                          <div className="text-sm font-medium text-default-900">
                            {parseFloat(validator.voting_power).toFixed(2)} %
                            <span className="text-sm font-light text-default-600">
                              &nbsp;{`(Rank=${rank})`}
                            </span>
                          </div>
                        </div>
                        <div className="border border-dashed border-default-300 rounded py-2.5 px-3 min-w-fit lg:min-w-[148px]">
                          <div className="text-sm font-medium text-default-500 capitalize">
                            Commission Rate
                          </div>
                          <div className="text-sm font-medium text-default-900">
                            {Math.ceil(validator.commission_rate, 2)} %
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center p-6 gap-x-4 gap-y-3 lg:gap-x-6 pb-0 pt-2 flex-wrap">
                <a
                  href=""
                  className="text-xs text-default-500 capitalize pb-2 border-transparent cursor-pointer flex justify-between"
                >
                  <FaLink className="mt-0.5" />
                  &nbsp;Website
                </a>
                <a
                  href=""
                  className="text-sm font-semibold text-default-500 capitalize pb-2 border-b border-transparent cursor-pointer inline"
                >
                  <FaThreads />
                </a>
                <a
                  href=""
                  className="text-sm font-semibold text-default-500 capitalize pb-2 border-b border-transparent cursor-pointer inline"
                >
                  <FaXTwitter />
                </a>
                <a
                  href=""
                  className="text-sm font-semibold text-default-500 capitalize pb-2 border-b border-transparent cursor-pointer inline"
                >
                  <FaDiscord />
                </a>
                <a
                  href=""
                  className="text-sm font-semibold text-default-500 capitalize pb-2 border-b border-transparent cursor-pointer inline"
                >
                  <FaTelegram />
                </a>
                <div className="ml-auto">
                  <SubmitFormInSheet validator={validator} sendTransaction={sendTransaction} isPending={isPending} isSuccess={isSuccess} error={error} />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-6 pb-6">
              <div className="col-span-12 lg:col-span-4">
                <div className="rounded-md bg-card text-card-foreground shadow-sm">
                  <div className="flex space-y-1 px-4 py-3 border-b border-border flex-row justify-between items-center border-none">
                    <h3 className="text-lg font-bold text-default-800">
                      Staking
                    </h3>
                  </div>
                  <div className="ml-3 mr-6 mb-0">
                    <div className="text-left font-light flex justify-between dark:text-white">
                      <div className="font-base text-sm">
                        <div className="flex">
                          <div className="pl-2">Total Staked :</div>
                          <div className="pt-0.5 pl-1">
                            <Hover
                              covered={validator.covered}
                              slashed={numberWithSpaces(
                                parseFloat(validator.bonded_stake).toFixed(2) *
                                  0.25
                              )}
                            ></Hover>
                          </div>
                        </div>
                      </div>
                      {numberWithSpaces(
                        parseFloat(validator.bonded_stake).toFixed(2)
                      )}{" "}
                      NTN
                    </div>
                    <div className=" font-extralight text-xs flex justify-between">
                      <div className="font-normal text-xs">
                        &nbsp; &nbsp;&nbsp;&nbsp; &nbsp;Self bonded:{" "}
                      </div>
                      {numberWithSpaces(
                        parseFloat(validator.self_bonded_stake).toFixed(2)
                      )}{" "}
                      NTN
                    </div>
                    <div className="font-extralight text-xs flex justify-between">
                      <div className="font-normal text-xs">
                        &nbsp; &nbsp;&nbsp;&nbsp; &nbsp;Delegated:{" "}
                      </div>
                      {numberWithSpaces(
                        parseFloat(
                          parseFloat(validator.bonded_stake) -
                            parseFloat(validator.self_bonded_stake)
                        ).toFixed(2)
                      )}{" "}
                      NTN
                    </div>
                    <div className="pt-4 text-left font-light dark:text-white">
                      <div className="font-base text-sm flex justify-between">
                        <div className="flex">
                          <div className="pl-2">Total Slashed :</div>
                        </div>
                        <div
                          className={`dark:${
                            slashed !== "0.00" && "text-red-600"
                          } dark:${slashed !== "0.00" && "font-semibold"}`}
                        >
                          {numberWithSpaces(slashed)} NTN
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="pb-0">
                    <CustomizedLabelPie
                      height={263}
                      data={[
                        {
                          name: "Self Bonded",
                          value: parseFloat(validator.self_bonded_stake),
                        },
                        {
                          name: "Delegated",
                          value:
                            parseFloat(validator.bonded_stake) -
                            parseFloat(validator.self_bonded_stake),
                        },
                      ]}
                    />
                  </div>
                </div>
              </div>
              <div className="col-span-12 lg:col-span-8 space-y-6">
                <div className="rounded-md bg-card text-card-foreground shadow-sm">
                  <ReportChart
                    title={"Staking History"}
                    height={350}
                    series={series}
                    dates={dates}
                    colors={["#008ffb", "#f2c744", "#6b21a8", "#ff4560"]}
                  />
                </div>
              </div>
              <div className="col-span-12 lg:col-span-4">
                <div className="rounded-md bg-card text-card-foreground shadow-sm">
                  <div className="flex space-y-1 px-4 py-4 border-b border-border flex-row justify-between items-center border-none">
                    <h3 className="text-lg font-bold text-default-800">
                      Unstaking details
                    </h3>
                  </div>
                  <div className="ml-3 mr-6  pt-1">
                    <div className="text-left font-light flex justify-between dark:text-white">
                      <div className="font-base text-sm">
                        <div className="flex">
                          <div className="pl-2">Self unbonding stake :</div>
                        </div>
                      </div>
                      {numberWithSpaces(
                        parseFloat(validator.self_unbonding_stake).toFixed(2)
                      )}{" "}
                      NTN
                    </div>

                    <div className="pt-1 text-left font-light dark:text-white">
                      <div className="font-base text-sm flex justify-between">
                        <div className="flex">
                          <div className="pl-2">Self unbonding shares :</div>
                        </div>
                        <div>
                          {numberWithSpaces(
                            parseFloat(validator.self_unbonding_shares).toFixed(
                              2
                            )
                          )}{" "}
                          NTN
                        </div>
                      </div>
                    </div>
                    <div className="pt-1 text-left font-light dark:text-white">
                      <div className="font-base text-sm flex justify-between">
                        <div className="flex">
                          <div className="pl-2">Unbonding stake :</div>
                        </div>
                        <div>
                          {numberWithSpaces(
                            parseFloat(validator.unbonding_stake).toFixed(2)
                          )}{" "}
                          NTN
                        </div>
                      </div>
                    </div>
                    <div className="pt-1 text-left font-light dark:text-white pb-44 mb-2">
                      <div className="font-base text-sm flex justify-between">
                        <div className="flex">
                          <div className="pl-2">Unbonding shares :</div>
                        </div>
                        <div>
                          {numberWithSpaces(
                            parseFloat(validator.unbonding_shares).toFixed(2)
                          )}{" "}
                          NTN
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-12 lg:col-span-8">
                <div className="rounded-md bg-card text-card-foreground shadow-sm">
                  <ReportChart
                    title={"Rates Histories"}
                    height={250}
                    series={rates}
                    dates={dates}
                    colors={["#4ABA47", "#E19133"]}
                  />
                </div>
              </div>
              <div className="col-span-12 lg:col-span-4 ">
                <div className="rounded-md bg-card text-card-foreground shadow-sm"></div>
              </div>
              <div className="col-span-12 lg:col-span-8 p-0 -mt-2">
                <div className="rounded-md bg-card text-card-foreground shadow-sm">
                  <div className="flex space-y-1.5 px-4 py-4 border-b border-border flex-row justify-between items-center mb-3 border-none">
                    <h3 className="text-lg font-medium text-default-800">
                      Related Addresses
                    </h3>
                  </div>

                  <div className="flex flex-wrap md:justify-between md:w-[580px] md:gap-4 gap-2 md:px-4 px-5 ">
                    <div className="text-sm mt-1.5 font-medium text-default-950 truncate">
                      Treasury Address:
                    </div>
                    <div className="flex justify-between items-center w-full md:w-[400px]">
                      <div className="md:text-sm text-xs text-default-600 truncate w-[calc(100%-0.1rem)]">
                        {validator.treasury}
                      </div>
                      <div className="mr-0 pl-2">
                        <CopyToClipboardComponent text={validator.treasury} />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap md:justify-between md:w-[580px] md:px-4 px-5 md:gap-4 gap-2">
                    <div className="text-sm mt-1.5 font-medium text-default-950 truncate">
                      Oracle Address:
                    </div>
                    <div className="flex justify-between items-center w-full md:w-[400px]">
                      <div className="md:text-sm text-xs text-default-600 truncate w-[calc(100%-0.1rem)]">
                        {" "}
                        {validator.oracle_address}
                      </div>
                      <div className=" mr-0 pl-2">
                        <CopyToClipboardComponent
                          text={validator.oracle_address}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap md:justify-between md:w-[580px] md:gap-4 gap-2 md:space-x-4 md:space-y-1.5 md:px-4 px-5 ">
                    <div className="text-sm font-medium text-default-950 mt-1.5">
                      Liquid Address:
                    </div>
                    <div className="flex justify-between items-center w-full md:w-[400px]">
                      <div className="md:text-sm text-xs text-default-600 truncate w-[calc(100%-0.1rem)]">
                        {validator.liquid_contract}
                      </div>
                      <div className="mr-0 pl-2">
                        <CopyToClipboardComponent
                          text={validator.liquid_contract}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap md:justify-between md:w-[585px]  md:gap-4 gap-2 md:space-x-4 md:space-y-1.5 px-5 ">
                    <div className="md:-ml-1 text-sm font-medium text-default-950 mt-1.5">
                      Enode:
                    </div>
                    <div className="flex justify-between items-center w-full md:w-[400px]  pb-4">
                      <span className="md:text-sm text-xs text-default-600 truncate w-[calc(100%-0.1rem)] ">
                        <CopyComponent
                          pts="..."
                          left={23}
                          right={-23}
                          address={validator.enode}
                        />
                      </span>
                      <div className="mr-0 pl-2">
                        <CopyToClipboardComponent text={validator.enode} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-md bg-card text-card-foreground shadow-sm space-y-6">
              <div className="flex space-y-1.5 px-4 py-4 mb-6 border-border flex-row items-center">
              <h3 className="text-xl font-medium leading-none">
                  Delegators
                  <span className="ml-3 px-3 py-1 bg-gray-900 rounded-[6px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
                    <span className="text-success font-bold text-[15px] ">
                      Upcoming feature!
                    </span>
                  </span>
                </h3>
                <div className="flex-none flex items-center gap-3"></div>
              </div>
              <div className="pt-0 border-b border-default-200">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap justify-start gap-4">
                      <Table />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
