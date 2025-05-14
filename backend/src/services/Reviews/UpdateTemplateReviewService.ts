import ReviewTemplate from "../../models/ReviewTemplate";
import ReviewTemplateOption from "../../models/ReviewTemplateOption";

interface TemplateData {
  name: string;
  message: string;
  status: string;
  queueId: number;
  options: Array<{
    id?: number;
    number: number;
    qualification: string;
  }>;
}

const UpdateTemplateReviewService = async (id: number, data: TemplateData): Promise<ReviewTemplate> => {
  const { name, message, status, queueId, options } = data;

  const template = await ReviewTemplate.findByPk(id);

  if (!template) {
    throw new Error("Template não encontrado");
  }

  // Atualiza o template
  await template.update({ name, message, status, queueId });

  // Atualiza ou cria as opções
  if (options && options.length > 0) {
    for (const option of options) {
      if (option.id) {
        // Atualiza a opção existente
        const existingOption = await ReviewTemplateOption.findByPk(option.id);
        if (existingOption) {
          await existingOption.update(option);
        }
      } else {
        // Cria uma nova opção
        await ReviewTemplateOption.create({ ...option, templateId: id });
      }
    }
  }

  return template;
};

export default UpdateTemplateReviewService;