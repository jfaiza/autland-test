import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL + "/api"; // Change this if using a diffe // Change this if using a different backend API

export const api = axios.create({
  baseURL,
});
