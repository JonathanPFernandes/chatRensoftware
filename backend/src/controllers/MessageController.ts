import { Request, Response } from "express";

import SetTicketMessagesAsRead from "../helpers/SetTicketMessagesAsRead";
import { getIO } from "../libs/socket";
import Message from "../models/Message";

import ListMessagesService from "../services/MessageServices/ListMessagesService";
import ShowTicketService from "../services/TicketServices/ShowTicketService";
import DeleteWhatsAppMessage from "../services/WbotServices/DeleteWhatsAppMessage";
import SendWhatsAppMedia from "../services/WbotServices/SendWhatsAppMedia";
import SendWhatsAppMessage from "../services/WbotServices/SendWhatsAppMessage";


type IndexQuery = {
  pageNumber: string;
};

type MessageData = {
  body: string;
  fromMe: boolean;
  read: boolean;
  quotedMsg?: Message;
};

export const index = async (req: Request, res: Response): Promise<Response> => {
  const { ticketId } = req.params;
  const { pageNumber } = req.query as IndexQuery;

  const { count, messages, ticket, hasMore } = await ListMessagesService({
    pageNumber,
    ticketId
  });

  SetTicketMessagesAsRead(ticket);


  return res.json({ count, messages, ticket, hasMore });
};

export const store = async (req: Request, res: Response): Promise<Response> => {
  const { ticketId } = req.params;
  const { body, quotedMsg, options, templateId }: MessageData & { options?: any[]; templateId?: number } = req.body;
  const medias = req.files as Express.Multer.File[];

  const ticket = await ShowTicketService(ticketId);

  SetTicketMessagesAsRead(ticket);

  
  if (medias) {
    await Promise.all(
      medias.map(async (media: Express.Multer.File) => {
        await SendWhatsAppMedia({ media, ticket });
      })
    );
  } 
  
  if (options?.length) {
    // Concatena o body com as opções em uma única mensagem
    let fullMessage = body ? `${body}\n\n` : ""; // Adiciona o body, se existir
    fullMessage += options
      .sort((a, b) => a.number - b.number) // Ordena as opções
      .map(opt => `${opt.number} - ${opt.qualification}`) // Formata cada opção
      .join("\n"); // Junta as opções em linhas separadas

    console.log("Enviando mensagem única com body e opções:", fullMessage);

    // Envia a mensagem única
    await SendWhatsAppMessage({ body: fullMessage, ticket });

    // Atualiza as colunas `options` e `templateId` no modelo Ticket
    if (!ticket.options || !ticket.templateId) {
      console.log("Atualizando ticket com opções e templateId.");
      await ticket.update({
        options: true,
        templateId,
        ticketId: ticket.id
      });
    } else {
      console.log("As colunas `options` e `templateId` já foram atualizadas no ticket.");
    }
  } else {
    // Envia apenas a mensagem do body se não houver opções
    console.log("Enviando mensagem sem opções:", body);
    await SendWhatsAppMessage({ body, ticket, quotedMsg });
  }  
  

  return res.send();
};

export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { messageId } = req.params;

  const message = await DeleteWhatsAppMessage(messageId);

  const io = getIO();
  io.to(message.ticketId.toString()).emit("appMessage", {
    action: "update",
    message
  });

  return res.send();
};
