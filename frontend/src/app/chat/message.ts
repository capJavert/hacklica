import {Model} from "../modules/models/model";

export class Message extends Model {
  id: number;
  type: string;
  text: string;
  userId: number;
  name: string;
  document: DocumentRef;

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

export class DocumentReply extends MessageReply {
  document: Document;
}

export class Document {
  name: string;
  data: string;
  type: string = "file";
}

export class DocumentRef {
  id: number;
  path: string;
  type: string;
  name: string;
}
