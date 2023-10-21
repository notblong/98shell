import socketClient from "socket.io-client";

const URL = import.meta.env.VITE_API_URLS ?? "http://127.0.0.1:3000";
export const socket = socketClient(URL);
