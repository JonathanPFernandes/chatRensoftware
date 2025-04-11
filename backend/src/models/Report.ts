import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
  DataType
} from "sequelize-typescript";
import Ticket from "./Ticket"; // Importa o modelo Ticket para criar relacionamento
import Queue from "./Queue"; // Importa o modelo Queue para criar relacionamento
import Contact from "./Contact"; // Importa o modelo Contact para criar relacionamento
import User from "./User"; // Importa o modelo User para criar relacionamento

// Define a tabela 'Reports' no banco de dados
@Table
class Report extends Model<Report> {
  // Define a coluna 'id' como chave primária e auto-incremento
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  // Define a coluna 'ticketId' como chave estrangeira para a tabela Tickets
  @ForeignKey(() => Ticket)
  @Column
  ticketId: number;

  // Relaciona o modelo Report com o modelo Ticket
  @BelongsTo(() => Ticket)
  ticket: Ticket;

  // Define a coluna 'queueId' como chave estrangeira para a tabela Queues
  @ForeignKey(() => Queue)
  @Column
  queueId: number;

  // Relaciona o modelo Report com o modelo Queue
  @BelongsTo(() => Queue)
  queue: Queue;

  // Define a coluna 'contactId' como chave estrangeira para a tabela Contacts
  @ForeignKey(() => Contact)
  @Column
  contactId: number;

  // Relaciona o modelo Report com o modelo Contact
  @BelongsTo(() => Contact)
  contact: Contact;

  // Define a coluna 'userId' como chave estrangeira para a tabela Users
  @ForeignKey(() => User)
  @Column
  userId: number;

  // Relaciona o modelo Report com o modelo User
  @BelongsTo(() => User, { foreignKey: "userId", as: "user" })
  user: User;

  // Define a coluna 'startedAt' para armazenar a data de início do atendimento
  @Column(DataType.DATE)
  startedAt: Date | null;

  // Define a coluna 'startedBy' para armazenar o ID do atendente que iniciou o atendimento
  @Column(DataType.INTEGER)
  startedBy: number | null;

  // Relaciona o modelo Report com o modelo User para startedBy
  @BelongsTo(() => User, { foreignKey: "startedBy", as: "startedByUser" })
  startedByUser: User;

  // Define a coluna 'finishedBy' para armazenar o ID do atendente que finalizou o atendimento
  @Column(DataType.INTEGER)
  finishedBy: number | null;

  // Relaciona o modelo Report com o modelo User para finishedBy
  @BelongsTo(() => User, { foreignKey: "finishedBy", as: "finishedByUser" })
  finishedByUser: User;

  // Define a coluna 'initialStatus' para armazenar o status inicial do ticket
  @Column(DataType.STRING)
  atualStatus: string | null;

  // Define a coluna 'createdAt' para armazenar a data de criação do relatório
  @CreatedAt
  createdAt: Date;

  // Define a coluna 'updatedAt' para armazenar a data de atualização do relatório
  @UpdatedAt
  updatedAt: Date;

  // Define a coluna 'finishedAt' para armazenar a data de finalização do atendimento
  @Column(DataType.DATE)
  finishedAt: Date | null; 
}

export default Report; // Exporta o modelo Report para ser usado em outras partes do projeto