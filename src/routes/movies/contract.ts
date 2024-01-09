import Joi from "@hapi/joi";

const createMovieContract = Joi.object({
  name: Joi.string().required(),
  releaseDate: Joi.date().required(),
});

const updateMovieContract = Joi.object({
  name: Joi.string(),
  releaseDate: Joi.date(),
});

export { createMovieContract, updateMovieContract };
