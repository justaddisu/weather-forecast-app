import { asyncHandler } from "../utils/asyncHandler.js";
import { addFavoriteCity, getSearchHistory, listFavoriteCities, removeFavoriteCity } from "../services/userService.js";

export const getFavorites = asyncHandler(async (req, res) => {
  const favorites = await listFavoriteCities(req.user.id);
  res.json({ favorites });
});

export const createFavorite = asyncHandler(async (req, res) => {
  const favorite = await addFavoriteCity(req.user.id, req.body);
  res.status(201).json({ favorite });
});

export const deleteFavorite = asyncHandler(async (req, res) => {
  await removeFavoriteCity(req.user.id, req.params.id);
  res.status(204).send();
});

export const history = asyncHandler(async (req, res) => {
  const items = await getSearchHistory(req.user.id);
  res.json({ history: items });
});
