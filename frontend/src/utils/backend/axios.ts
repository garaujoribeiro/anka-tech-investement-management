import axios from "axios";

const backend = axios.create({
  // baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  baseURL: "http://localhost:3001",
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
  },
});

export { backend };
