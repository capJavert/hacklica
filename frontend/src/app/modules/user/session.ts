
import {RoleEnum} from "./role.enum";

export class Session {
  private _token: string;
  private _role: RoleEnum;

  constructor(token: string, role: RoleEnum) {
    this._token = token;
    this._role = role;
  }

  get token(): string {
    return this._token;
  }

  get headers() {
    return {
      Authorization: this._token
    };
  }
}
