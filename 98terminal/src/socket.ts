import socketClient from "socket.io-client";

// const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:4000';
const prodUrl = "https://lobster-app-5occx.ondigitalocean.app/";
const URL =
  // prodUrl ??
  "http://127.0.0.1:3000";
export const socket = socketClient(URL);
