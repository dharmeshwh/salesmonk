import Joi from "@hapi/joi";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

const validate = (schema: Joi.ObjectSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const submitData = { ...req.body };

      const { error } = schema.validate(submitData);

      if (error) {
        const { details } = error;
        let errorMessage: string = details[0].message;

        errorMessage = errorMessage.replace(/"/g, "");

        throw new Error(errorMessage);
      }

      next();
    } catch (err: any) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: err.message,
        status: false,
      });
    }
  };
};

export { validate };
