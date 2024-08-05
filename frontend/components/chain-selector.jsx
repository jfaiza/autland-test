'use client'

import React, { useEffect, useState } from "react";
import { useChainStore } from "@/store/index";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { SendToBack } from "lucide-react";
import { api } from "@/config/axios.config";
// useRouter
import { useRouter } from 'next/navigation'

const ChainSelector = () => {
  const { selectedChain, setSelectedChain } = useChainStore();
  const [chains, setChains] = useState([]);
  const [open, setOpen] = useState(false); // State for menu visibility
  const router = useRouter()
  
  const handleClick = (event) => {
    event.preventDefault(); // Prevent default dropdown behavior
    setOpen(!open);
  };
  
  const handleSelect = (chain) => {
    setSelectedChain(chain);
    setOpen(false);
    router.push('/', { scroll: false })
  };
  useEffect(() => {
    let chainset = {};
    let chainlist = [];
    api.get("/chains/").then((res) => {
      res.data.forEach((chain) => {
        chainset[chain.network_name] = chain.chain_id;
        chainlist.push([chain.network_name, chain.chain_id]);
      });
      setChains(chainlist);
      if (
        (!selectedChain || !(selectedChain[0] in chainset)) &&
        chainlist.length > 0
      )
        setSelectedChain(chainlist[0]);
    });
  }, []);

  return (
    <div className="chain-selector">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            onClick={handleClick}
            className="ml-auto bg-transparent"
          >
            <SendToBack className="mr-2 h-4 w-5" />
            {selectedChain[0]}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuRadioGroup
            value={selectedChain}
            onValueChange={handleSelect}
          >
            {chains.map((chain) => (
              <DropdownMenuRadioItem key={chain} value={chain}>
                {chain[0]}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ChainSelector;
