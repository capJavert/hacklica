import {Injectable} from "@angular/core";
import {WebService} from "../modules/service/web.service";
import {Notification} from "./notification";
import {UserInstance} from "../modules/user/user.instance";
import {Observable} from "rxjs/Observable";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";

@Injectable()
export class UserService extends WebService<any> {

  constructor(http: HttpClient) {
    super(http);
  }

  get endpoint(): string {
    return "/user/" + UserInstance.id;
  }

  get primaryKey(): string {
    return "id";
  }

  notifications(options?: {
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
  }): Observable<Array<Notification>> {
    return this.http.get<Array<Notification>>(this.servicePath + "/components", options);
  }

  hide(componentId): Observable<any> {
    return this.http.get<any>(this.servicePath + "/components/" + componentId + "/hide");
  }

  pin(componentId): Observable<any> {
    return this.http.get<any>(this.servicePath + "/components/" + componentId + "/pin");
  }

  unpin(componentId): Observable<any> {
    return this.http.get<any>(this.servicePath + "/components/" + componentId + "/unpin");
  }

  email(componentId): Observable<any> {
    return this.http.get<any>(this.base + this.path + "/emails/" + componentId);
  }

  document(componentId): Observable<any> {
    return this.http.get<any>(this.base + this.path + "/document/" + componentId);
  }

  event(componentId): Observable<any> {
    return this.http.get<any>(this.base + this.path + "/event/" + componentId);
  }
}
