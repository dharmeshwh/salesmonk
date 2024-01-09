import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../client";
import { Prisma } from "@prisma/client";

export class MovieService {
  async addMovie(request: Request, response: Response) {
    try {
      const { name, releaseDate } = request.body;

      const movie = await prisma.movie.create({
        data: {
          name,
          releaseDate: new Date(releaseDate).toISOString(),
        },
      });

      return response
        .status(StatusCodes.CREATED)
        .send({ status: true, data: movie });
    } catch (error: any) {
      return response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ status: true, message: error.message });
    }
  }

  async updateMovie(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const { name, releaseDate } = request.body;

      const movie = await prisma.movie.findUnique({
        where: { id: parseInt(id, 10) },
        select: {
          id: true,
        },
      });

      if (!movie) {
        return response
          .status(StatusCodes.NOT_FOUND)
          .send({ status: false, message: "movie not found" });
      }

      const effectedMovie = await prisma.movie.update({
        where: {
          id: movie.id,
        },
        data: {
          ...(name && { name }),
          ...(releaseDate && { releaseDate }),
        },
      });

      return response
        .status(StatusCodes.CREATED)
        .send({ status: true, data: effectedMovie });
    } catch (error: any) {
      return response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ status: true, message: error.message });
    }
  }

  async deleteMovie(request: Request, response: Response) {
    const { id } = request.params;
    try {
      const movie = await prisma.movie.findUnique({
        where: { id: parseInt(id, 10) },
        select: {
          id: true,
        },
      });

      if (!movie) {
        return response
          .status(StatusCodes.NOT_FOUND)
          .send({ status: false, message: "movie not found" });
      }

      await prisma.review.deleteMany({ where: { movieId: parseInt(id, 10) } });

      await prisma.movie.delete({
        where: { id: parseInt(id, 10) },
      });

      return response.status(StatusCodes.ACCEPTED).send({ status: true });
    } catch (error: any) {
      return response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ status: true, message: error.message });
    }
  }

  async getAllMovie(request: Request, response: Response) {
    try {
      const { page = 1, take = 10 } = request.query;

      const skip = (Number(page) - 1) * Number(take);

      const movies = await prisma.movie.findMany({ take: Number(take), skip });

      return response
        .status(StatusCodes.ACCEPTED)
        .send({ status: true, data: movies });
    } catch (error: any) {
      return response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ status: true, message: error.message });
    }
  }

  async searchMovie(request: Request, response: Response) {
    const { search } = request.query;
    try {
      const movies = await prisma.movie.findMany({
        where: {
          name: {
            contains: (search as string).toLowerCase(),
            mode: Prisma.QueryMode.insensitive,
          },
        },
      });
      return response
        .status(StatusCodes.ACCEPTED)
        .send({ status: true, data: movies });
    } catch (error: any) {
      return response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ status: true, message: error.message });
    }
  }
}
