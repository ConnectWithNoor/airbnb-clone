import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.ENDPOINT_ORIGIN,
  headers: { "Content-Type": "application/json" },
});

export default axiosInstance;
