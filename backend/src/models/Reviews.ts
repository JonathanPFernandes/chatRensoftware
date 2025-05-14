import {
    Table,
    Column,
    Model,
    PrimaryKey,
    AutoIncrement,
    AllowNull,
    ForeignKey,
    BelongsTo,
    CreatedAt,
    UpdatedAt,
  } from "sequelize-typescript";
  import User from "./User";
  import Queue from "./Queue";
  import Contact from "./Contact";
  import Whatsapp from "./Whatsapp";
  import ReviewTemplate from "./ReviewTemplate";
import Ticket from "./Ticket";
  
  @Table
  class Reviews extends Model<Reviews> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;
  
    @AllowNull(false)
    @Column
    name: string; // Nome da avaliação
  
    @ForeignKey(() => Queue)
    @Column
    queueId: number;
  
    @BelongsTo(() => Queue)
    queue: Queue;
  
    @ForeignKey(() => User)
    @Column
    userId: number;
  
    @BelongsTo(() => User)
    user: User;
  
    @ForeignKey(() => Whatsapp)
    @Column
    whatsappId: number;
  
    @BelongsTo(() => Whatsapp)
    whatsapp: Whatsapp;

    @ForeignKey(() => Ticket)
    @Column 
    ticketId: number;

    @BelongsTo(() => Ticket)
    ticket: Ticket;

    @AllowNull(true)
    @Column
    nota: number;
  
    @ForeignKey(() => ReviewTemplate)
    @Column
    templateId: number;

    @BelongsTo(() => ReviewTemplate)
    template: ReviewTemplate;

    // Nova coluna contactId
    @ForeignKey(() => Contact)
    @Column
    contactId: number;

    // Relacionamento com a tabela Contact
    @BelongsTo(() => Contact)
    contato: Contact;

    @CreatedAt
    createdAt: Date;
    
    @UpdatedAt
    updatedAt: Date;
  }
  
  export default Reviews;