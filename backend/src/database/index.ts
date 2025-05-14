import { Sequelize } from "sequelize-typescript";
import User from "../models/User";
import Setting from "../models/Setting";
import Contact from "../models/Contact";
import Ticket from "../models/Ticket";
import Whatsapp from "../models/Whatsapp";
import ContactCustomField from "../models/ContactCustomField";
import Message from "../models/Message";
import Queue from "../models/Queue";
import WhatsappQueue from "../models/WhatsappQueue";
import UserQueue from "../models/UserQueue";
import Report from "../models/Report";
import QuickAnswer from "../models/QuickAnswer";
import Tag from "../models/Tag";
import ContactTag from "../models/ContactTag";
import Integration from "../models/Integration";
import Reviews from "../models/Reviews"; 
import ReviewTemplate from "../models/ReviewTemplate"; 
import ReviewTemplateOption from "../models/ReviewTemplateOption"; 

// eslint-disable-next-line
const dbConfig = require("../config/database");
// import dbConfig from "../config/database";

const sequelize = new Sequelize(dbConfig);

const models = [
  User,
  Contact,
  Ticket,
  Message,
  Whatsapp,
  ContactCustomField,
  Setting,
  Queue,
  Report,
  WhatsappQueue,
  UserQueue,
  QuickAnswer,
  Tag,
  ContactTag,
  Integration,
  Reviews, 
  ReviewTemplate, 
  ReviewTemplateOption 
];

sequelize.addModels(models);

export default sequelize;
