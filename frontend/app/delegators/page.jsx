"use client";

import { useEffect, useState } from "react";
import { getValidators } from "@/app/api/validators/route";
import { getBondTransactionParams } from "@/app/api/delegators/route";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useChainStore } from "@/store";

const page = () => {
  const { selectedChain, setSelectedChain } = useChainStore();
  const [validators, setValidators] = useState([{}]);
  const [user_address, setUser_address] = useState("");
  const [tx, setTx] = useState({});

  useEffect(() => {
    getValidators(selectedChain).then((data) => {
      setValidators(data);
      console.log(data.data);
    });
  }, []);

  const bond_handler = async(address) => {
    const transaction = (await getBondTransactionParams(address, 1)).props.data
    console.log(transaction);
    const from = (await ethereum.request({ method: 'eth_requestAccounts' }))[0]
    console.log(from)
    transaction.from = '0xFD32bD07c0BD6bf1802De9c93B0Be97799c11EFb';
    console.log(transaction);
    try {
        
        const res = await ethereum.request({ method: 'eth_sendTransaction', params: [transaction] })
        console.log(res)
    } catch (error) {
      console.log(error.message)
    }
  };

  return (
    <div className="text-2xl font-semibold">
      Validators ........
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">N</TableHead>
              <TableHead>Validators</TableHead>
              <TableHead>Commission Rate</TableHead>
              <TableHead className="text-right">Voting Power</TableHead>
              <TableHead className="text-right">Stacked</TableHead>
              <TableHead className="text-right">Slashed</TableHead>
              <TableHead className="text-right">State</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
              {validators.map((validator, index) => (
            <TableRow>
              <TableCell key={index+1} className="font-medium">
                  {index+1}
                </TableCell>
                <TableCell key={validator.node_address} className="font-medium">
                  {validator.node_address}
                </TableCell>
                <TableCell key={validator.commission_rate} className="font-medium">
                  {validator.commission_rate}%
                </TableCell>
                <TableCell key={validator} className="font-medium">
                  {Number(validator.voting_power).toFixed(2)}%
                </TableCell>
                <TableCell key={validator.bonded_stake} className="font-medium">
                  {validator.bonded_stake}
                </TableCell>
                <TableCell key={validator.state} className="font-medium">
                  {}
                </TableCell>

                <TableCell key={validator.total_slashed} className="font-medium">
                  {validator.total_slashed}
                </TableCell>
                <TableCell key={validator.total_slashed} className="font-medium">
                  {validator.state}
                </TableCell>
                <TableCell key={index} className="font-medium">
                  <button className="btn btn-primary" onClick={()=>bond_handler(validator.node_address)}>bond</button>
                </TableCell>

            </TableRow>
              ))}

          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default page;
