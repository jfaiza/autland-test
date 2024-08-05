"use client";

import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import React from "react";
import { Pickaxe } from "@/components/svg";
import { Badge } from "@/components/ui/badge";

export default function Component({ commiteeMemberColor, text='', inDetails=false }) {
  const isCommitee = commiteeMemberColor == "31D0AA";
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
        {inDetails ?
          <div
            className={`flex justify-between rounded-full border py-[0.1rem] px-[0.4rem] text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${isCommitee ?"bg-[#31D0AA] bg-opacity-10 border-transparent" : "border-spacing-1 "} }]`}
          >
              <Pickaxe  viewBox="0 -3 22 24" stroke={`#${commiteeMemberColor}`}></Pickaxe>
            <span className= {isCommitee ?"text-[#31D0AA] ml-1" : "text-[#a9a9a949] ml-1"} >Committee</span>
          </div>
        :  <Badge
              variant="halfRounded"
              className={"w-6 p-1 h-5 border-spacing-1"}
              color={commiteeMemberColor}
            >
              <Pickaxe width="15" height="15" viewBox="1 1 22 20" stroke={`#${commiteeMemberColor}`}></Pickaxe>
            </Badge>}
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {isCommitee
              ? `Validator allowed in the consensus committee.`
              : `Validator not allowed in the consensus committee.`}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
