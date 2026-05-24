import api, { withAuth } from "./api";

export const userService = {
  async getFavorites(token) {
    const { data } = await api.get("/users/favorites", withAuth(token));
    return data;
  },
  async addFavorite(token, payload) {
    const { data } = await api.post("/users/favorites", payload, withAuth(token));
    return data;
  },
  async removeFavorite(token, id) {
    await api.delete(`/users/favorites/${id}`, withAuth(token));
  },
  async getHistory(token) {
    const { data } = await api.get("/users/history", withAuth(token));
    return data;
  },
};
