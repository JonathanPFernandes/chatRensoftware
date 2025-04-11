import { Request, Response } from "express";
import TicketReport from "../models/Report";
import Contact from "../models/Contact";
import User from "../models/User";
import Queue from "../models/Queue";

export const index = async (req: Request, res: Response): Promise<Response> => {
  try {
    const reports = await TicketReport.findAll({
      include: [
        {
          model: Contact,
          attributes: ["name"], // Inclui apenas o campo 'name' da tabela Contact
        },
        {
          model: User,
          as: "user", // Alias para o relacionamento com userId
          attributes: ["name"], // Inclui apenas o campo 'name' da tabela User
        },
        {
          model: Queue,
          attributes: ["name"], // Inclui apenas o campo 'name' da tabela Queue
        },
        {
          model: User,
          as: "startedByUser", // Alias definido no relacionamento
          attributes: ["name"], // Inclui apenas o campo 'name' da tabela User
        },
        {
          model: User,
          as: "finishedByUser", // Alias definido no relacionamento
          attributes: ["name"], // Inclui apenas o campo 'name' da tabela User
        },
      ],
      order: [["createdAt", "DESC"]], // Ordena por data de criação
    });

    return res.status(200).json(reports); // Retorna os relatórios com os dados do contato
  } catch (error) {
    console.error("Erro ao buscar relatórios:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};