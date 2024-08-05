import { api } from "@/config/axios.config";


export async function getBondTransactionParams(to, amount, chain) {
  const response = await api.get(`validator/stake/?amount=${amount}&address=${to}`,{params: {chain: chain}});
  const data = response.data;
  // Pass data to the page component as props
  return {
    props: { data },
  };
}