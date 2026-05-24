import { Router } from "express";
import { createFavorite, deleteFavorite, getFavorites, history } from "../controllers/userController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { favoriteCitySchema } from "../validators/weatherSchemas.js";

const router = Router();

router.use(requireAuth);

router.get("/favorites", getFavorites);
router.post("/favorites", validate(favoriteCitySchema), createFavorite);
router.delete("/favorites/:id", deleteFavorite);
router.get("/history", history);

export default router;
