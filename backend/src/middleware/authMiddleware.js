import { prisma } from "../config/prisma.js";
import { verifyToken } from "../utils/jwt.js";
import { AppError } from "../utils/appError.js";

function extractToken(req) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.slice(7);
}

export async function optionalAuth(req, res, next) {
  const token = extractToken(req);

  if (!token) {
    return next();
  }

  try {
    const payload = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, name: true, email: true },
    });

    if (user) {
      req.user = user;
    }
  } catch {
    req.user = null;
  }

  next();
}

export async function requireAuth(req, res, next) {
  const token = extractToken(req);

  if (!token) {
    return next(new AppError("Authentication required", 401));
  }

  try {
    const payload = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, name: true, email: true },
    });

    if (!user) {
      return next(new AppError("User not found", 401));
    }

    req.user = user;
    next();
  } catch {
    next(new AppError("Invalid or expired token", 401));
  }
}
