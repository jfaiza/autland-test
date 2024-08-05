"use client"

import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { ShieldCheck } from "lucide-react"
import React from "react"

export default function Component({covered, slashed}) {
  return (
    <TooltipProvider>
    <Tooltip>
        <div className="-mt-1">
      <TooltipTrigger>
          <ShieldCheck strokeWidth={3} className={covered ? 'stroke-green-600 w-4' : 'stroke-red-700 w-4' }>
      </ShieldCheck>
      </TooltipTrigger>
        </div>
      <TooltipContent>
        <p>{covered ?  `Self bonded is more than 25% of Total Staked (Low risk of slashing delegated NTN)` 
        : 
        `Self bonded is less than 25% of Total Staked (Risk of slashing delegated NTN)`}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
  )
}