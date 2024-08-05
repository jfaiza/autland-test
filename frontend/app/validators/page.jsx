"use client";

import { useEffect, useState } from "react";
import { getValidators } from "@/app/api/validators/route";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { useChainStore } from "@/store";
import  LayoutLoader  from "@/components/layout-loader";

const Page = () => {
  const { selectedChain, setSelectedChain } = useChainStore();
  const [validators, setValidators] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    getValidators(selectedChain)
      .then((data) => {
        setValidators(data);
      })
      .then(() => setLoading(false));
  }, [selectedChain]);

  if (loading)
    return (
      <LayoutLoader />
    );
  return (
    <div className="text-2xl font-semibold">
      <h1 className="mb-6 text-3xl font-bold">Validators</h1>
      <div className="bg-white  dark:bg-slate-800" >
        <DataTable columns={columns} data={validators} />
      </div>
    </div>
  );
};

export default Page;
