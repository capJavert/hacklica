import {Component, Input} from '@angular/core';
import {MessageService} from "../chat/message.service";
import {Message} from "../chat/message";
import {ConditionsUtil} from "../modules/utils/ConditionsUtil";
import {Users} from "../modules/user/user.instance";

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.less']
})
export class EventComponent {
  private _event;
  messages: Message[];
  users = Users.slice();

  get event() {
    return this._event;
  }

  @Input("event")
  set event(value) {
    this._event = value;

    if (ConditionsUtil.isNotNull(value)) {
      this.messageService.messages(this.event.componentId).subscribe(
        (messages) => {
          this.messages = messages;
        },
        error => console.log(error)
      )
    }
  }

  constructor(private messageService: MessageService) {
    this.messages = [];
  }

  isLive(timestamp: number) {
    return timestamp >= (Date.now() / 1000 | 0);
  }

  capitalizeFirstLetter(string) {
    return string[0].toUpperCase() + string.substr(1);
  }

  userImage(username: string) {
    let user = this.users.filter(obj => obj.name === username);

    if (ConditionsUtil.isNotNullNorEmpty(user)) {
      return "/assets/img/" + user[0].image;
    } else {
      return "/assets/img/null.jpg";
    }
  }
}
