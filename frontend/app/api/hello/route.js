import { api } from "../../../config/axios.config";

export async function getValidators() {
    const response = await api.get('validators/');
    const data = response.data;
    // Pass data to the page component as props
    return {
      props: { data },
    };
  }



