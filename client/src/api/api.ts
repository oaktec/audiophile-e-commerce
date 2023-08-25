import axios, { AxiosRequestConfig } from "axios";

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://audiophile-e-commerce-server.fly.dev"
    : "http://localhost:3001";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = BASE_URL;

export default {
  get: async (path: string, options: AxiosRequestConfig = {}) => {
    const res = await axios.get(path, {
      ...options,
    });

    return res.data as unknown;
  },
  post: async (
    path: string,
    body?: unknown,
    options: AxiosRequestConfig = {},
  ) => {
    const res = await axios.post(path, body, {
      ...options,
    });

    return res.data as unknown;
  },
};
