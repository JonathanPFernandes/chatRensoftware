import Reviews from "../../models/Reviews";

interface ReviewData {
  name: string;
  queueId: number;
  userId: number;
  whatsappId: number;
  templateId: number;
  contactId?: number;
  nota?: number 
  ticketId?: number;
}

const CreateReviewService = async (data: ReviewData): Promise<Reviews> => {
  const { name, queueId, userId, whatsappId, templateId, contactId, nota, ticketId  } = data;

  // Cria o registro na tabela Reviews, incluindo o contactId
  const review = await Reviews.create({ name, queueId, userId, whatsappId, templateId, contactId, nota, ticketId });

  return review;
};

export default CreateReviewService;