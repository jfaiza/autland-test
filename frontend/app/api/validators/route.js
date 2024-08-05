import { api } from "../../../config/axios.config";


export async function getValidators(chain) {
    const response = await api.get('validators/', {params: {chain: chain}});
    const data = response.data;
    // Pass data to the page component as props
    return data ;
  }
export async function getValidatorDetail(chain, node_address) {
    const response = await api.get('validators/details/', {params: {chain: chain, node_address: node_address}});
    const data = response.data;
    // Pass data to the page component as props
    return data ;
  }

  export async function getValidator(chain, node_address) {
    const response = await api.get('validator/', {params: {chain: chain, node_address: node_address}});
    const data = response.data;
    // Pass data to the page component as props
    return data ;
  }