import { ConditionsUtil } from "../utils/ConditionsUtil";

export abstract class FilterModel {
  toParams(): {[param: string]: string | string[]} {
    let params = {};

    for (let key of Object.keys(this)) {
      if (ConditionsUtil.isNotNullNorEmpty(this[key].toString())) {
        params[key] = this[key].toString();
      }
    }

    return params;
  }
}
