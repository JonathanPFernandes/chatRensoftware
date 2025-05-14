import {
    Table,
    Column,
    Model,
    PrimaryKey,
    AutoIncrement,
    AllowNull,
    ForeignKey,
    BelongsTo
  } from "sequelize-typescript";
  import ReviewTemplate from "./ReviewTemplate";
  
  @Table
  class ReviewTemplateOption extends Model<ReviewTemplateOption> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;
  
    @AllowNull(false)
    @Column
    number: number; // Número da opção (ex.: 1, 2, 3, etc.)
  
    @AllowNull(false)
    @Column
    qualification: string; // Qualificação da opção (ex.: "Bom", "Ruim", etc.)
  
    @ForeignKey(() => ReviewTemplate)
    @Column
    templateId: number;
  
    @BelongsTo(() => ReviewTemplate)
    template: ReviewTemplate;
  }
  
  export default ReviewTemplateOption;