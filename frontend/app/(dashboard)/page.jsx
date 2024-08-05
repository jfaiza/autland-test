"use client";
import dynamic from "next/dynamic";
import { ArrowRight, Atom, ShieldCheck } from "lucide-react";
import { AutonityLogo, ChartNoAxesCombined } from "@/components/svg";
const CustomizedLabelPie = dynamic(
  () => import("@/components/ui/customized-label-apex-pie"),
  { ssr: false }
);
const CustomizedLabelDonut = dynamic(
  () => import("@/components/ui/customized-label-apex-donut"),
  { ssr: false }
);
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { useEffect, useState } from "react";
import { getValidatorsInfos } from "@/app/api/dashboard/route";
import { useChainStore } from "@/store";
import LayoutLoader from "@/components/layout-loader";

const page = () => {
  const { selectedChain } = useChainStore();
  const [validators, setValidators] = useState({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setLoading(true);
      getValidatorsInfos(selectedChain)
        .then((data) => {
          setValidators(data);
          console.log(data);
        })
        .then(() => setLoading(false));
    }
  }, [selectedChain]);

  if (typeof window === "undefined") return null;
  if (loading) return <LayoutLoader />;
  return (
    <div className="layout-padding md:px-0 px-0 page-min-height">
      <h1 className="mb-4 text-3xl font-medium">Dashboard</h1>

      <div className="opacity: 1; transform: none;">
        <main className="">
          <div className="">
            {/* grid grid-cols-12 gap-6 pb-6 */}
            <div className="grid grid-cols-12 gap-6 pb-6">
              <div className="col-span-12 lg:col-span-5 gap-2">
                <div className="rounded-md bg-white shadow-sm min-w-[380px]">
                  <div className="flex space-y-1 px-1 py-1 border-b border-border justify-center items-center border-none">
                    <p className="xl:text-3xl text-xl  font-semibold text-default-800 dark:text-default-100 ">
                      Welcome to Autonity LAND
                    </p>
                  </div>
                  <div className="justify-start items-center gap-4 xl:p-1 p-2 grid grid-cols-12 max-w-[700px]">
                    <div className="col-span-4 -ml-2">
                      <AutonityLogo
                        viewBox={"180 180 300 320"}
                        width={180}
                        height={120}
                        color={"black"}
                        strokeWidth={0}
                      />
                    </div>
                    <div className="col-span-8 p-2">
                      <p className="text-default-950 dark:text-default-100 xl:text-lg text-base font-normal lg:p-1 xl:ml-3 ml-5">
                        The Land of Decentralised Markets & Smart Derivative
                        Contracts
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-12 lg:col-span-7 grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-4 space-y-6">
                  <div className="rounded-md bg-card text-card-foreground shadow-sm flex justify-center items-center">
                    <Atom height={173} width={190} strokeWidth={0.5} />
                  </div>
                </div>
                <div className="col-span-12 lg:col-span-4 space-y-6">
                  <div className="rounded-md bg-card text-card-foreground shadow-sm flex justify-center items-center">
                    <ChartNoAxesCombined
                      height={173}
                      width={190}
                      strokeWidth={0.5}
                    />
                  </div>
                </div>
                <div className="col-span-12 lg:col-span-4 space-y-6">
                  <div className="rounded-md bg-card text-card-foreground shadow-sm flex justify-center items-center">
                    <ShieldCheck height={173} width={190} strokeWidth={0.5} />
                  </div>
                </div>
              </div>

              <div className="col-span-12 lg:col-span-4">
                <div className="rounded-md bg-card text-card-foreground shadow-sm">
                  <div className="flex space-y-1 px-2 py-6 border-b border-border flex-row justify-center items-center border-none">
                    <h3 className="flex justify-center items-start text-2xl font-semibold text-default-800">
                      Validators
                    </h3>
                  </div>
                  <div className="pt-1 px-0 mx-0">
                    <CustomizedLabelPie
                      height={250}
                      formatter={false}
                      pie_colors={[
                        "#31D0AA",
                        "#6b7280",
                        "#f97316",
                        "#ef4444",
                        "#e9f1a3",
                        // "#6366f1",
                      ]}
                      label={[
                        "Committee",
                        "Paused",
                        "Jailed",
                        "Jailbond",
                        "The rest",
                      ]}
                      data={[
                        {
                          name: "committee",
                          value: parseFloat(validators["committee"]),
                        },
                        {
                          name: "paused",
                          // value: parseFloat(2),
                          value: parseFloat(validators["paused"]),
                        },
                        {
                          name: "jailed",
                          // value: parseFloat(2),
                          value: parseFloat(validators["jailed"]),
                        },
                        {
                          name: "jailbond",
                          value: parseFloat(validators["jailbond"]),
                          // value: parseFloat(2),
                        },
                        {
                          name: "rest",
                          value: parseFloat(validators["rest"]),
                          // value: parseFloat(2),
                        },
                      ]}
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-12 lg:col-span-8 grid grid-cols-12 gap-0 rounded-md bg-card text-card-foreground shadow-sm">
                <div className="col-span-12 lg:col-span-5  border-r-2 ">
                  <div className="rounded-md bg-card text-card-foreground shadow-sm">
                    <div className="flex space-y-1 px-2 py-6 border-b border-border flex-row justify-center items-center border-none">
                      <h3 className="flex justify-center items-start text-2xl font-semibold text-default-800">
                        Total Supply
                      </h3>
                    </div>
                    <div className="pt-1 px-0 mx-0">
                      <CustomizedLabelDonut
                        height={250}
                        data={[
                          {
                            name: "Staked",
                            value: parseFloat(validators.bonded_stake).toFixed(
                              2
                            ),
                          },
                          {
                            name: "The rest",
                            // value: parseFloat(55500),
                            value: parseFloat(validators.rest_supply).toFixed(
                              2
                            ),
                          },
                        ]}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-12 lg:col-span-7 space-y-2">
                  <div className="rounded-md bg-card text-card-foreground shadow-sm xl:text-lg text-base p-6 ">
                    <span className="text-info font-semibold">
                      Stake (Bond)
                    </span>{" "}
                    as much or as little as you want.
                    <p>
                      However, the greater the portion of voting power you have
                      in a given consensus committee, the greater your rewards
                    </p>
                    <div className="mt-5 grid grid-cols-12  items-center gap-1 lg:gap-6 mb-5">
                      {/* <div className=" col-span-7  border border-dashed border-default-300 rounded py-2.5 px-3 ">
                        <div className="text-sm font-medium text-default-500 capitalize ">
                          Total staked (Bonded)
                        </div>
                        <div className="text-sm font-medium text-default-900 pt-2">
                          {numberWithSpaces(parseFloat(validators.bonded_stake).toFixed(2))}  NTN
                        </div>
                      </div> */}
                      <div className="col-span-12 border border-dashed border-default-300 rounded py-2.5 lg:px-3 px-1">
                        <div className="lg:text-sm font-medium text-default-500 capitalize">
                          Unbonding Period
                        </div>
                        <div className="text-sm font-medium text-default-900 pt-2">
                          {validators.unbonding_period} hours
                          <span className="text-sm font-light text-default-600"></span>
                        </div>
                      </div>
                    </div>
                    <Button
                      asChild
                      className="mt-4 mb-2 hover:bg-white hover:text-info bg-info text-white text-lg px-2 rounded-[0.5rem] h-10 ml-auto flex justify-center"
                      size="lg"
                    >
                      <Link href="/validators">
                        <p className="ml-2">Start Staking</p>
                        <span className="hover:bg-white hover:stroke-info">
                          <ArrowRight className="h-7 black  dark:white dark:to-info-700" />
                        </span>
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default page;
