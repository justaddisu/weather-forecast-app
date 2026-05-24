import { Router } from "express";
import { searchWeather, suggestions } from "../controllers/weatherController.js";
import { optionalAuth } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { citySearchQuerySchema, suggestionQuerySchema } from "../validators/weatherSchemas.js";

const router = Router();

router.get("/search", optionalAuth, validate(citySearchQuerySchema, "query"), searchWeather);
router.get("/suggestions", validate(suggestionQuerySchema, "query"), suggestions);

export default router;
