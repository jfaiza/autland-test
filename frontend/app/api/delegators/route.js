import { api } from "../../../config/axios.config";


export async function getBondTransactionParams(to, amount) {

  const response = await api.get(`delegators/?amount=${amount}&address=${to}`,);
  const data = response.data;
  // Pass data to the page component as props
  return {
    props: { data },
  };
}