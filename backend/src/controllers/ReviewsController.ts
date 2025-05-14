import { Request, Response } from "express";
import CreateReviewService from "../services/Reviews/CreateReviewsService";
import ListReviewsService from "../services/Reviews/ListReviewsService";


export const create = async (req: Request, res: Response): Promise<Response> => {
  try {
    const reviewData = req.body;

    // Chama o serviço para criar a avaliação
    const review = await CreateReviewService(reviewData);

    return res.status(201).json(review);
  } catch (error) {
    console.error("Erro ao criar avaliação:", error);
    return res.status(500).json({ error: "Erro ao criar avaliação" });
  }
};

export const show = async (req: Request, res: Response): Promise<Response> => {
  try {
    const reviews = await ListReviewsService();

    return res.status(200).json(reviews);
  } catch (error) {
    console.error("Erro ao listar avaliações:", error);
    return res.status(500).json({ error: "Erro ao listar avaliações" });
  }
};