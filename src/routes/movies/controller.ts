import { Router } from "express";
import { validate } from "../../middleware/validate";
import { createMovieContract, updateMovieContract } from "./contract";
import { MovieService } from "./service";

const movieRouter = Router();
const movieService = new MovieService();

movieRouter.get("/", movieService.getAllMovie);

movieRouter.put(
  "/:id",
  validate(updateMovieContract),
  movieService.updateMovie
);

movieRouter.delete("/:id", movieService.deleteMovie);

movieRouter.post("/", validate(createMovieContract), movieService.addMovie);

export = movieRouter;
