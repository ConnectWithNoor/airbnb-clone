import axios from "axios";

const axiosInstance = axios.create({
  //   baseURL: "",
  timeout: 1000,
});

export default axiosInstance;
