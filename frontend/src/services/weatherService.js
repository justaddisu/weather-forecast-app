import api, { withAuth } from "./api";

export const weatherService = {
  async getWeather(city, token) {
    const config = token ? withAuth(token) : {};
    const { data } = await api.get("/weather/search", {
      ...config,
      params: { city },
    });
    return data;
  },
  async getSuggestions(query) {
    const { data } = await api.get("/weather/suggestions", {
      params: { q: query },
    });
    return data;
  },
};
