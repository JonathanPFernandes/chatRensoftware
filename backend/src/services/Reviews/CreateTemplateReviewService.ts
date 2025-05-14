import ReviewTemplate from "../../models/ReviewTemplate";
import ReviewTemplateOption from "../../models/ReviewTemplateOption";

interface TemplateData {
  name: string;
  message: string;
  status: string;
  queueId: number;
  options: Array<{
    number: number;
    qualification: string;
  }>;
}

const CreateReviewTemplateService = async (data: TemplateData): Promise<ReviewTemplate> => {
  const { name, message, status, queueId, options } = data;

  const template = await ReviewTemplate.create({ name, message, status, queueId });

  if (options && options.length > 0) {
    const templateOptions = options.map((option) => ({
      ...option,
      templateId: template.id
    }));
    await ReviewTemplateOption.bulkCreate(templateOptions);
  }

  return template;
};

export default CreateReviewTemplateService;