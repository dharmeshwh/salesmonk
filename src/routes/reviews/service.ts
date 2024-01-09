import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../client";

export class ReviewService {
  async addReview(request: Request, response: Response) {
    try {
      const { movieId, rating, reviewComments, reviewerName } = request.body;

      const movie = await prisma.movie.findUnique({
        where: {
          id: parseInt(movieId, 10),
        },
        select: {
          id: true,
          averageRating: true,
        },
      });

      if (!movie) {
        return response
          .status(StatusCodes.NOT_FOUND)
          .send({ status: false, message: "movie not found" });
      }

      const reviewCount = await prisma.review.count({
        where: {
          movieId: parseInt(movieId, 10),
        },
      });

      const review = await prisma.review.create({
        data: {
          rating: Number(rating),
          reviewComments,
          reviewerName,
          movieId: parseInt(movieId, 10),
        },
      });

      await prisma.movie.update({
        where: {
          id: Number(movieId),
        },
        data: {
          averageRating:
            ((movie?.averageRating ?? 0) * reviewCount + Number(rating)) /
            (reviewCount + 1),
        },
      });

      return response
        .status(StatusCodes.ACCEPTED)
        .send({ status: true, data: review });
    } catch (error: any) {
      return response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ status: false, message: error.message });
    }
  }

  async updateReview(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const { reviewerName, rating, reviewComments } = request.body;

      const review = await prisma.review.findUnique({
        where: { id: parseInt(id, 10) },
        select: {
          id: true,
        },
      });

      if (!review) {
        return response
          .status(StatusCodes.NOT_FOUND)
          .send({ status: false, message: "review not found" });
      }

      await prisma.review.update({
        where: {
          id: review.id,
        },
        data: {
          ...(reviewerName && { reviewerName }),
          ...(rating && { rating }),
          ...(reviewComments && { reviewComments }),
        },
      });

      return response
        .status(StatusCodes.ACCEPTED)
        .send({ status: true, data: review });
    } catch (error: any) {
      return response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ status: true, message: error.message });
    }
  }

  async deleteReview(request: Request, response: Response) {
    try {
      const { id } = request.params;

      const review = await prisma.review.findUnique({
        where: {
          id: parseInt(id, 10),
        },
        select: {
          id: true,
        },
      });

      if (!review) {
        return response
          .status(StatusCodes.NOT_FOUND)
          .send({ status: false, message: "review not found" });
      }

      await prisma.review.delete({
        where: {
          id: review.id,
        },
      });

      return response.status(StatusCodes.ACCEPTED).send({ status: true });
    } catch (error: any) {
      return response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ status: true, message: error.message });
    }
  }

  async getAllReview(request: Request, response: Response) {
    try {
      const { movieId } = request.params;

      const movie = await prisma.movie.findUnique({
        where: {
          id: parseInt(movieId, 10),
        },
        include: {
          reviews: {
            select: {
              id: true,
              reviewerName: true,
              rating: true,
              reviewComments: true,
            },
          },
        },
      });

      if (!movie) {
        return response
          .status(StatusCodes.NOT_FOUND)
          .send({ status: false, message: "movie not found" });
      }

      return response
        .status(StatusCodes.ACCEPTED)
        .send({ status: true, data: movie });
    } catch (error: any) {
      return response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ status: true, message: error.message });
    }
  }

  async searchReview(request: Request, response: Response) {
    const { search } = request.query;
    try {
      const reviews = await prisma.review.findMany({
        where: { reviewComments: { contains: search as string } },
      });
      return response.json(reviews);
    } catch (error: any) {
      return response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ status: true, message: error.message });
    }
  }
}
