import {Model} from "../modules/models/model";

export class Notification extends Model {
  id: number;
  name: string;
  type: string;
  last_notif: number;
  pinned: boolean = false;


  constructor() {
    super();

    Notification.primaryKey = "id";
  }
}
