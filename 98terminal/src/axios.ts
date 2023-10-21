import axios from "axios";

axios.defaults.baseURL =
  import.meta.env.VITE_API_URLS ?? "http://127.0.0.1:3000";

export default axios;
