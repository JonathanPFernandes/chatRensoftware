import { Request, Response } from 'express';
import CreateTemplateReviewService from "../services/Reviews/CreateTemplateReviewService";
import ListTemplateReviewService from "../services/Reviews/ListTemplateReviewService";
import UpdateTemplateReviewService from "../services/Reviews/UpdateTemplateReviewService";
import DeleteTemplateReviewService from "../services/Reviews/DeleteTemplateReviewService";

export const create = async (req: Request, res: Response): Promise<Response> => {
    try {
        const templateData = req.body;
        console.log("Dados do template:", templateData);
        // Chama o serviço para criar o template de avaliação
        const template = await CreateTemplateReviewService(templateData);

        return res.status(201).json(template);
    } catch (error) {
        console.error("Erro ao criar template:", error);
        return res.status(500).json({ error: "Erro ao criar template" });
    }
};

export const show = async (req: Request, res: Response): Promise<Response> => {
    try {
        const templates = await ListTemplateReviewService();

        return res.status(200).json(templates);
    } catch (error) {
        console.error("Erro ao listar templates:", error);
        return res.status(500).json({ error: "Erro ao listar templates" });
    }
};

export const update = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const templateData = req.body;

        const updatedTemplate = await UpdateTemplateReviewService(Number(id), templateData);

        return res.status(200).json(updatedTemplate);
    } catch (error) {
        console.error("Erro ao atualizar template:", error);
        return res.status(500).json({ error: "Erro ao atualizar template" });
    }
};

export const remove = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;

        // Chama o serviço para deletar o template de avaliação
        await DeleteTemplateReviewService(Number(id));

        return res.status(204).send();
    } catch (error) {
        console.error("Erro ao deletar template:", error);
        return res.status(500).json({ error: "Erro ao deletar template" });
    }
};

