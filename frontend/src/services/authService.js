import api, { withAuth } from "./api";

export const authService = {
  async register(payload) {
    const { data } = await api.post("/auth/register", payload);
    return data;
  },
  async login(payload) {
    const { data } = await api.post("/auth/login", payload);
    return data;
  },
  async getProfile(token) {
    const { data } = await api.get("/auth/me", withAuth(token));
    return data;
  },
};
