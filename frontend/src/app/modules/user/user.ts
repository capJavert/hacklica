import {Session} from "./session";

export class User {
  private _session: Session;

  id: number;
  public username: string;
  public firstname: string;
  public lastname: string;
  public organization: Organization;
  public image: string;

  constructor() {
    this.id = 1;
    this.username = "Ante Baric";
    this.image = "ante.jpg";
  }

  get session(): Session {
    return this._session;
  }

  set session(value: Session) {
    this._session = value;
  }

  get isAuth(): boolean {
    return this._session != null;
  }
}
