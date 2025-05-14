import ReviewTemplate from "../../models/ReviewTemplate";

const DeleteTemplateReviewService = async (id: number): Promise<void> => {
  const template = await ReviewTemplate.findByPk(id);

  if (!template) {
    throw new Error("Template não encontrado");
  }

  // Exclui o template e as opções associadas (cascade)
  await template.destroy();
};

export default DeleteTemplateReviewService;