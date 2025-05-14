import ReviewTemplate from "../../models/ReviewTemplate";
import ReviewTemplateOption from "../../models/ReviewTemplateOption";
import Queue from "../../models/Queue";
import User from "../../models/User";   
import Whatsapp from "../../models/Whatsapp";


const ListTemplateReviewService = async (): Promise<ReviewTemplate[]> => {
  const templates = await ReviewTemplate.findAll({
    include: [
      { model: Queue, as: "queue" },
      { model: ReviewTemplateOption, as: "options" },
    ]
  });

  return templates;
};      

export default ListTemplateReviewService;