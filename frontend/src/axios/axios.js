import Axios from "axios";

const axiosInstance = Axios.create({
  baseURL: "/api", // Update with your server's root URL
});

export default axiosInstance;
