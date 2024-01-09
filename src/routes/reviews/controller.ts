import { Router } from "express";
import { validate } from "../../middleware/validate";
import { addReviewContract, updateReviewContract } from "./contract";
import { ReviewService } from "./service";

const reviewRouter = Router();
const reviewService = new ReviewService();

reviewRouter.get("/:movieId", reviewService.getAllReview);

reviewRouter.get("/search", reviewService.searchReview);

reviewRouter.put(
  "/",
  validate(updateReviewContract),
  reviewService.updateReview
);

reviewRouter.delete("/:id", reviewService.deleteReview);

reviewRouter.post("/", validate(addReviewContract), reviewService.addReview);

export = reviewRouter;
