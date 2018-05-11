import {Injectable} from "@angular/core";
import {WebService} from "../modules/service/web.service";
import {Message, MessageReply} from "./message";
import {Observable} from "rxjs/Observable";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Model} from "../modules/models/model";

@Injectable()
export class MessageService extends WebService<Message> {


  constructor(http: HttpClient) {
    super(http);
  }

  get endpoint(): string {
    return "/messages";
  }

  get primaryKey(): string {
    return "id";
  }

  messages(id: number, options?: {
    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    observe?: 'body';
    params?: HttpParams | {
      [param: string]: string | string[];
    };
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
  }): Observable<Array<Message>> {
    return this.http.get<Array<Message>>(this.servicePath + "/" + id, options);
  }

  send(model: MessageReply, options?: {
    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    observe?: 'body';
    params?: HttpParams | {
      [param: string]: string | string[];
    };
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
  }): Observable<Message> {
    return this.http.post<Message>(this.base + this.path + "/message/text" , model);
  }
}
