import axios from "axios";

const prodUrl = "https://lobster-app-5occx.ondigitalocean.app/";
axios.defaults.baseURL =
  // prodUrl ??
  "http://127.0.0.1:3000";

export default axios;
