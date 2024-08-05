import { api } from "../../../config/axios.config";

export async function getValidatorsInfos(chain) {
    const response = await api.get('validators/dashboard/', {params: {chain: chain}});
    const data = response.data;
    // Pass data to the page component as props
    return  data
  }
