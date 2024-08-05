"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CleaveInput } from "@/components/ui/cleave";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { config } from "@/config";
import { Toaster, toast } from "sonner";
import { ArrowRight, PauseCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAccount, useSendTransaction } from "wagmi";
import { SendTransactionButton } from "./send-transaction-button";
import Modal from "./transaction_state"; // Adjust the import path as necessary

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

export default function SubmitFormInDrawer({
  validator,
  sendTransaction,
  isPending,
  isSuccess,
  error,
}) {
  const { isConnected, address } = useAccount({ config });
  const [amount, setAmount] = useState();
  const [isModalOpen, setModalOpen] = useState(false);
  React.useEffect(() => {
    if (isPending || isSuccess || error) {
      setModalOpen(true);
    }
  }, [isPending, isSuccess, error]);
  if (!isConnected)
    return (
      <Sheet>
        <SheetTrigger asChild>
          <AlertDialog>
            <AlertDialogTrigger>
              <Button className="mb-2 hover:bg-white hover:text-info bg-info text-white px-2 rounded-[0.5rem] h-8 ml-auto flex justify-end">
                <p className="ml-2">Stake</p>
                {/* <ArrowRight className="h-5 black hover:bg-white hover:text-info dark:white dark:stroke-lime-50" /> */}
                <span className="hover:bg-white hover:stroke-info">
                  <ArrowRight className="h-5 black  dark:white dark:to-info-700" />
                </span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[300px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] p-[9px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
              <AlertDialogDescription className="text-success font-bold mt-4 mb-5 text-[15px] leading-normal flex justify-center">
                Connect your wallet first!
              </AlertDialogDescription>
              <AlertDialogCancel asChild>
                <button className="bg-warning border-spacing-1 font-bold text-primary-200 text-mauve11 hover:bg-mauve5 inline-flex h-[35px] items-center justify-center rounded-[4px] ">
                  Ok
                </button>
              </AlertDialogCancel>
            </AlertDialogContent>
          </AlertDialog>
        </SheetTrigger>
      </Sheet>
    );
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="mb-2 hover:bg-white hover:text-info bg-info text-white px-2 rounded-[0.5rem] h-8 ml-auto flex justify-end">
          <p className="ml-2">Stake</p>
          {/* <ArrowRight className="h-5 black hover:bg-white hover:text-info dark:white dark:stroke-lime-50" /> */}
          <span className="hover:bg-white hover:stroke-info">
            <ArrowRight className="h-5 black  dark:white dark:to-info-700" />
          </span>
        </Button>
      </SheetTrigger>
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          loading={isPending}
          success={isSuccess}
          error={error}
        >
          <ScrollArea>
            {isPending && <div className="">Transaction loading!</div>}
            {isSuccess && (
              <div className="">Transaction sent successfully!</div>
            )}
            {error && <div className="">Error: {error.message}</div>}
          </ScrollArea>
        </Modal>
      )}
      <SheetContent className="max-w-[736px] p-0">
        <SheetHeader className="text-3xl font-bold text-default-700 py-3 pl-4">
          <SheetTitle>Stake To Validator</SheetTitle>
        </SheetHeader>
        <hr />
        <div className="px-5 py-6 h-[calc(100vh-120px)]">
          <ScrollArea className="h-full">
            <div className="py-2">
              <h3 className="text-xl font-bold text-default-700">
                Selected Validator
              </h3>
              <div className="flex justify-start">
                <p className="text-default-700  mt-2">
                  Name :
                  <span className="text-default-600">
                    {`  Validator#`}
                    {validator.validator_name === "unknown"
                      ? `Block: ${validator.registration_block}`
                      : validator.validator_name}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-default-700 mt-1">
                  Node address :
                  <span className="text-default-600">{`  ${validator.node_address}`}</span>
                </p>
              </div>
            </div>
            <div className="flex-1 mt-4 mb-4">
              <div className="flex flex-wrap justify-start gap-4">
                <div className="border border-dashed border-default-300 rounded py-2.5 px-3 min-w-fit lg:min-w-[120px] pt-1">
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
                <div className="border border-dashed border-default-300 rounded py-2.5 px-3 min-w-fit lg:min-w-[120px] pt-1">
                  <div className="text-sm font-medium text-default-500 capitalize">
                    Voting Power
                  </div>
                  <div className="text-sm font-medium text-default-900">
                    {parseFloat(validator.voting_power).toFixed(2)} %
                    <span className="text-sm font-extralight text-default-500">
                      {/* &nbsp;{`(Rank=${rank})`} */}
                    </span>
                  </div>
                </div>
                <div className="border border-dashed border-default-300 rounded py-2.5 px-3 min-w-fit lg:min-w-[120px] pt-1">
                  <div className="text-sm font-medium text-default-500 capitalize">
                    Commission Rate
                  </div>
                  <div className="text-sm font-medium text-default-900">
                    {Math.ceil(validator.commission_rate, 2)} %
                  </div>
                </div>
              </div>
            </div>
            {/* form */}
            <div className="md:grid md:grid-cols-1 gap-4 mt-6 space-y-2 md:space-y-0 border p-3">
              <h3 className="text-2xl font-normal">Staking</h3>
              {/* <div className="pb-2 mb-2 md:col-span-4">
                <p>
                  My Delegation:
                  <span className="ml-24 text-blue-400"> 10 000 LNTN</span>
                </p>
                <p className="pt-1">
                  My Self Bonded:{" "}
                  <span className="ml-24 text-green-600">10 000 NTN</span>
                </p>
              </div> */}
              <div className="md:col-span-4 border-t-[3px]"></div>
              <div className="md:col-span-2">
                <div className="flex flex-col gap-2">
                  <h3 className="text-2xl font-normal mt-0">To Stake</h3>
                  <p className="text-medium font-normal">Amount to Stake</p>
                  <div className="flex items-center">
                    <CleaveInput
                      id="nu prefix"
                      options={{
                        numeral: true,
                        numeralDecimalScale: 18,
                        delimiter: ",",
                        prefix: "NTN   ",
                      }}
                      placeholder="Amount to Stake"
                      value={amount}
                      onChange={(e) =>
                        setAmount(e.target.value.split("   ")[1])
                      }
                    ></CleaveInput>
                    {/* <input
                      type="number"
                      className="remove-arrow w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                      value={amount}
                      min={0}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Amount to Stake"
                    /> */}
                  </div>
                </div>
              </div>
              <div className="mb-2 md:col-span-4 pt-4 w-full flex justify-center">
                <SheetFooter>
                  <SheetClose asChild>
                    <Button className="mr-2 bg-slate-600 text-white px-6 rounded-[0.5rem] h-8 ml-auto">
                      <p>Cancel</p>
                    </Button>
                  </SheetClose>
                  <SheetClose>
                    <SendTransactionButton
                      from={address}
                      to={validator.node_address}
                      amount={amount}
                      sendTransaction={sendTransaction}
                      isPending={isPending}
                    />
                  </SheetClose>
                </SheetFooter>
              </div>
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}
