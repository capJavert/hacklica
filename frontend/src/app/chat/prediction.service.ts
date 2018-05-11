import {Injectable} from "@angular/core";
import {WebService} from "../modules/service/web.service";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {Term} from "./term";

@Injectable()
export class PredictionService extends WebService<any> {
  constructor(http: HttpClient) {
    super(http);
  }

  get endpoint(): string {
    return "/get-search";
  }

  get primaryKey(): string {
    return undefined;
  }

  search(term: string): Observable<Term> {
    return this.http.get<Term>("http://team3.vm.hacklica.hr:3000" + this.endpoint, {params: {term: term}});
  }
}
