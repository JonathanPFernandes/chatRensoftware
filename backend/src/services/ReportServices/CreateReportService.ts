import Ticket from "../../models/Ticket";
import TicketReport from "../../models/Report";

const CreateReportService = async (ticketId: number): Promise<TicketReport> => {
  // Verifica se já existe um relatório para o ticketId
  const existingReport = await TicketReport.findOne({ where: { ticketId } });

  if (existingReport) {
    console.log(`Relatório já existe para o ticketId: ${ticketId}`);
    return existingReport; // Retorna o relatório existente
  }

  // Busca o ticket no banco de dados
  const ticket = await Ticket.findByPk(ticketId);

  if (!ticket) {
    throw new Error("Ticket não encontrado");
  }

  // Cria o relatório com os dados do ticket
  const report = await TicketReport.create({
    ticketId: ticket.id,
    atualStatus: ticket.status,
    contactId: ticket.contactId || null,
    userId: ticket.userId || null,
    queueId: ticket.queueId || null,
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt
  });

  console.log(`Relatório criado para o ticketId: ${ticketId}`);
  return report;
};

export default CreateReportService;