import {Injectable} from "@angular/core";
import {WebService} from "../modules/service/web.service";
import {Observable} from "rxjs/Observable";
import {HttpClient} from "@angular/common/http";
import {DocumentComponent, MessageComponent} from "./component";
import {Notification} from "../home/notification";

@Injectable()
export class ComponentService extends WebService<any> {

  constructor(http: HttpClient) {
    super(http);
  }

  get endpoint(): string {
    return "/component";
  }

  get primaryKey(): string {
    return undefined;
  }

  send(model: MessageComponent): Observable<Notification> {
    return this.http.post<Notification>(this.servicePath + "/message" , model);
  }

  upload(model: DocumentComponent): Observable<Notification> {
    return this.http.post<Notification>(this.servicePath + "/document" , model);
  }
}
