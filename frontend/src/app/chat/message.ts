import {Model} from "../modules/models/model";

export class Message extends Model {
  id: number;
  type: string;
  text: string;
  userId: number;
  name: string;

  constructor() {
    super();

    Message.primaryKey = "id";
  }
}

export class MessageReply {
  userId: number;
  componentId: number;
  message: string;
}
