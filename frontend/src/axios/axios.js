import Axios from "axios";

const axiosInstance = Axios.create({
  baseURL: "http://localhost:3002", // Update with your server's root URL
});

export default axiosInstance;
