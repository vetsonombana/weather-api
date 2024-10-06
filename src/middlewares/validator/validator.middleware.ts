import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

export const validator = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query);
      return next();
    } catch (e) {
      res.status(403).json({status: 403, message: "A parameter is missing"});
    }
  };
};
