const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://audiophile-e-commerce-server.fly.dev"
    : "http://localhost:3001";

export default {
  fetch: async (path: string, options?: RequestInit) => {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      credentials: "include",
    });
    const data = await res.json();
    return data;
  },
};
