import {Component, EventEmitter, Output} from '@angular/core';
import {Document, Message} from "../chat/message";
import {ConditionsUtil} from "../modules/utils/ConditionsUtil";
import {UserInstance, Users} from "../modules/user/user.instance";
import {DocumentComponent, EventComponentModel} from "./component";
import {ComponentService} from "./component.service";
import {MessageService} from "../chat/message.service";

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.less']
})
export class CreateComponent {
  @Output() endEditing = new EventEmitter<boolean>();
  users = Users.slice();
  selectedUsers = [];
  isNewMessage: boolean = true;
  chatId: number = null;
  messages: Message[];

  eventComponent: EventComponentModel;
  eventTypes = [
    "Meetup",
    "Launch",
    "Teambuilding",
    "Conference",
    "Meeting"
  ];

  constructor(private componentService: ComponentService,
              private messageService: MessageService) {
    this.messages = [];
    this.eventComponent = new EventComponentModel();
  }

  sendMessage(message: string) {
    if (ConditionsUtil.isNotNullNorEmpty(message)) {
      let newMessage = new DocumentComponent();
      newMessage.receivers = this.selectedUsers.map((user) => {
        return user.id;
      });
      newMessage.userId = UserInstance.id;
      newMessage.message = message;

      this.componentService.send(newMessage).subscribe(
        (notification) => {
          this.isNewMessage = false;
          this.chatId = notification.id;

          this.messageService.messages(this.chatId).subscribe(
            (messages) => {
              this.messages = messages;
            },
            error => console.log(error)
          );
        },
        error => console.log(error)
      )
    }
  }

  uploadFile(document: Document) {
    if (ConditionsUtil.isNotNullNorEmpty(document)) {
      let newDocument = new DocumentComponent();
      newDocument.receivers = this.selectedUsers.map((user) => {
        return user.id;
      });
      newDocument.userId = UserInstance.id;
      newDocument.message = "";
      newDocument.document = document;

      this.componentService.upload(newDocument).subscribe(
        () => {
          this.emitEndEditing();
        },
        error => console.log(error)
      )
    }
  }

  createEvent() {
    if (ConditionsUtil.isNotNull(this.eventComponent)) {
      this.eventComponent.timeStart = (new Date(this.eventComponent.timeStart).getTime() / 1000);
      this.eventComponent.receivers = this.selectedUsers.map((user) => {
        return user.id;
      });
      this.eventComponent.userId = UserInstance.id;

      this.componentService.createEvent(this.eventComponent).subscribe(
        () => {
          this.emitEndEditing();
        },
        error => console.log(error)
      )
    }
  }

  selectUser(user, event) {
    event.preventDefault();

    this.selectedUsers.push(user);
    this.users.splice(this.users.indexOf(user), 1);
  }

  removeUser(user, event) {
    event.preventDefault();

    this.users.push(user);
    this.selectedUsers.splice(this.selectedUsers.indexOf(user), 1);
  }

  emitEndEditing() {
    this.endEditing.emit(true);
  }
}
