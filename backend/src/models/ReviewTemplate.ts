import {
    Table,
    Column,
    Model,
    PrimaryKey,
    AutoIncrement,
    AllowNull,
    ForeignKey,
    BelongsTo,
    HasMany,
    CreatedAt,
    UpdatedAt,
  } from "sequelize-typescript";
  import Queue from "./Queue";
  import ReviewTemplateOption from "../models/ReviewTemplateOption";
  
  @Table
  class ReviewTemplate extends Model<ReviewTemplate> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;
  
    @AllowNull(false)
    @Column
    name: string; // Nome do modelo de avaliação
  
    @AllowNull(false)
    @Column
    message: string; // Mensagem da avaliação
  
    @AllowNull(false)
    @Column
    status: string; // Status do modelo (ex.: "active", "inactive")
  
    @ForeignKey(() => Queue)
    @Column
    queueId: number; // Setor associado ao modelo
  
    @BelongsTo(() => Queue)
    queue: Queue;
  
    @HasMany(() => ReviewTemplateOption)
    options: ReviewTemplateOption[];

    @CreatedAt
    createdAt: Date;
    
    @UpdatedAt
    updatedAt: Date;
  }
  
  export default ReviewTemplate;