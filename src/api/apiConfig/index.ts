import axios from "axios";

export const instance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1/",
  withCredentials: true,
  headers: {
    "API-KEY": "db8d2f12-200b-4467-ba1f-cd791df3f39c",
  },
});
