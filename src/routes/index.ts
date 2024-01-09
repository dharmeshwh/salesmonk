import { Router } from "express";
import movieRouter from "./movies/controller";
import reviewRouter from "./reviews/controller";

const router = Router();

router.use("/movies", movieRouter);

router.use("/reviews", reviewRouter);

export = router;
