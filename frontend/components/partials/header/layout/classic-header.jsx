import React from "react";
import { cn } from "@/lib/utils";
import { Providers } from './provider'

const ClassicHeader = ({ children, className, initialState  }) => {
  return (
    <header className={cn("z-50", className)}>
      <Providers initialState={initialState}>
          {children}
        </Providers>
    </header>
  );
};

export default ClassicHeader;
