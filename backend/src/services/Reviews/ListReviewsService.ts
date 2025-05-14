import Reviews from "../../models/Reviews";
import Queue from "../../models/Queue";
import User from "../../models/User";
import Whatsapp from "../../models/Whatsapp";
import ReviewTemplate from "../../models/ReviewTemplate";
import Contact from "../../models/Contact";

const ListReviewsService = async (): Promise<Reviews[]> => {
  const reviews = await Reviews.findAll({
    include: [
      { model: Queue, as: "queue" },
      { model: User, as: "user" },
      { model: Whatsapp, as: "whatsapp" },
      { model: ReviewTemplate, as: "template" },
      {model: Contact, as: "contato", attributes: ["name"] },
    ]
  });

  return reviews;
};

export default ListReviewsService;