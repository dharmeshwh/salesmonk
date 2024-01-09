import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const port = 3000;

app.use(express.json());

const prisma = new PrismaClient();

// Create Movie
app.post("/movies", async (req: Request, res: Response) => {
  try {
    const { name, releaseDate } = req.body;

    const movie = await prisma.movie.create({
      data: {
        name,
        releaseDate: new Date(releaseDate).toISOString(),
      },
    });

    return res.status(201).json(movie);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Read Movies
app.get("/movies", async (_, res: Response) => {
  const movies = await prisma.movie.findMany();
  res.json(movies);
});

// Update Movie
app.put("/movies/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updatedMovie = await prisma.movie.update({
      where: { id: parseInt(id, 10) },
      data: req.body,
    });
    res.json(updatedMovie);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete Movie
app.delete("/movies/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.review.deleteMany({ where: { movieId: parseInt(id, 10) } });
    const deletedMovie = await prisma.movie.delete({
      where: { id: parseInt(id, 10) },
    });
    res.json(deletedMovie);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Search Reviews
app.get("/reviews/search", async (req: Request, res: Response) => {
  const { search } = req.query;
  try {
    const reviews = await prisma.review.findMany({
      where: { reviewComments: { contains: search as string } },
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create Review
app.post("/reviews", async (req: Request, res: Response) => {
  try {
    const review = await prisma.review.create({ data: req.body });
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Read Reviews for a Movie
app.get("/reviews/:movieId", async (req: Request, res: Response) => {
  const { movieId } = req.params;
  try {
    const reviews = await prisma.review.findMany({
      where: { movieId: parseInt(movieId, 10) },
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update Review
app.put("/reviews/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updatedReview = await prisma.review.update({
      where: { id: parseInt(id, 10) },
      data: req.body,
    });
    res.json(updatedReview);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete Review
app.delete("/reviews/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedReview = await prisma.review.delete({
      where: { id: parseInt(id, 10) },
    });
    res.json(deletedReview);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
