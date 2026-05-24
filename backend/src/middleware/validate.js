import { AppError } from "../utils/appError.js";

export function validate(schema, source = "body") {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return next(new AppError("Validation failed", 400, result.error.flatten().fieldErrors));
    }

    req[source] = result.data;
    next();
  };
}
