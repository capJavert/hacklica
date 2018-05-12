import {Document} from "../chat/message";

export class Component {
  userId: number;
  receivers: number[];
}

export class MessageComponent extends Component {
  message: string;
}

export class DocumentComponent extends MessageComponent {
  document: Document;
}

export class EventComponentModel extends Component {
  name: string;
  timeStart: number;
  type: string;
}
