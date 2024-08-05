"use client"

import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import React from "react"

export default function Component({address, left=10, right=-6, pts='...'}) {
  return (
    <TooltipProvider>
    <Tooltip>
      <TooltipTrigger>
        {address.slice(0, left)}{pts}{address.slice(right)}
      </TooltipTrigger>
      <TooltipContent>
        <p>{address}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
  )
}