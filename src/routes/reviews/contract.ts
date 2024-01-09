import Joi from "@hapi/joi";

const addReviewContract = Joi.object({
  movieId: Joi.string().required(),
  reviewerName: Joi.string().required(),
  rating: Joi.string().required(),
  reviewComments: Joi.string().required(),
});

const updateReviewContract = Joi.object({
  reviewerName: Joi.string(),
  rating: Joi.number(),
  reviewComments: Joi.string(),
});

export { updateReviewContract, addReviewContract };
