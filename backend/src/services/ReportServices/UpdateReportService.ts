import Ticket from "../../models/Ticket";
import TicketReport from "../../models/Report";
import CreateReportService from "../ReportServices/CreateReportService";

const UpdateTicketReportService = async (ticketId: number): Promise<void> => {
  const ticket = await Ticket.findByPk(ticketId);

  if (!ticket) {
    throw new Error("Ticket não encontrado");
  }

  // Tenta encontrar o relatório correspondente ao ticket
  let report = await TicketReport.findOne({ where: { ticketId } });

  // Se o relatório não existir, cria um novo
  if (!report) {
    report = await CreateReportService(ticketId);
  }

  // Atualiza apenas os campos que não são nulos
  await report.update({
    atualStatus: ticket.status || report.atualStatus,
    contactId: ticket.contactId || report.contactId,
    userId: ticket.userId || report.userId,
    queueId: ticket.queueId || report.queueId,
    updatedAt: ticket.updatedAt,
    startedAt: report.startedAt === null && ticket.status === "open" ? ticket.updatedAt : report.startedAt,
    startedBy: report.startedBy === null && ticket.status === "open" ? ticket.userId : report.startedBy,
    finishedAt: ticket.status === "closed" ? ticket.updatedAt : report.finishedAt,
    finishedBy:  ticket.status === "closed" ? ticket.userId : report.finishedBy,
    
  });
};

export default UpdateTicketReportService;