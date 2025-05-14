import { getIO } from "../../libs/socket";
import Message from "../../models/Message";
import Ticket from "../../models/Ticket";
import Whatsapp from "../../models/Whatsapp";
import Reviews from "../../models/Reviews";
import CreateReviewService from "../Reviews/CreateReviewsService";

interface MessageData {
  id: string;
  ticketId: number;
  body: string;
  contactId?: number;
  fromMe?: boolean;
  read?: boolean;
  mediaType?: string;
  mediaUrl?: string;
}
interface Request {
  messageData: MessageData;
}

const CreateMessageService = async ({
  messageData
}: Request): Promise<Message> => {
  await Message.upsert(messageData);

  const message = await Message.findByPk(messageData.id, {
    include: [
      "contact",
      {
        model: Ticket,
        as: "ticket",
        include: [
          "contact", "queue",
          {
            model: Whatsapp,
            as: "whatsapp",
            attributes: ["name"]
          }
        ]
      },
      {
        model: Message,
        as: "quotedMsg",
        include: ["contact"]
      }
    ]
  });

  if (!message) {
    throw new Error("ERR_CREATING_MESSAGE");
  }

  console.log("Mensagem criada com sucesso:", message.body);
  // Primeira Verificação: se `ticket.options` for true e `ticket.templateId` estiver definido
  const { ticket } = message;
  if (ticket.options && ticket.templateId) {
    console.log("O ticket possui opções e templateId.");

    // Segunda Verificação: se o corpo da mensagem for um número entre 1 e 10
    const nota = parseInt(message.body, 10);
    if (!isNaN(nota) && nota >= 1 && nota <= 10) {
      console.log(`Mensagem válida recebida com nota ${nota}.`);

      // Verifica se já existe uma avaliação para o ticket
      const existingReview = await Reviews.findOne({ where: { ticketId: ticket.id } });
      if (!existingReview) {
        console.log(`Criando avaliação para o ticket ${ticket.id}.`);

        // Chama o CreateReviewsService para criar a avaliação
        await CreateReviewService({
          name: `Avaliação Automática`,
          queueId: ticket.queueId,
          userId: ticket.userId,
          whatsappId: ticket.whatsappId,
          templateId: ticket.templateId,
          contactId: ticket.contactId,
          nota, // Atribui o valor da nota
          ticketId: ticket.id
        });

        // Emite um evento WebSocket para notificar o frontend
        const io = getIO();
        io.emit("Reviews", {
          contactId: ticket.contactId,
          fromMe: false,
          body: nota,
          type: "success"
        });

      } else {
        console.log(`Já existe uma avaliação para o ticket ${ticket.id}.`);
      }
    } else {
      console.log(`Mensagem inválida ignorada: ${message.body}`);
    }
  }

  const io = getIO();
  io.to(message.ticketId.toString())
    .to(message.ticket.status)
    .to("notification")
    .emit("appMessage", {
      action: "create",
      message,
      ticket: message.ticket,
      contact: message.ticket.contact
    });

  return message;
};

export default CreateMessageService;
