import {Component, EventEmitter, Output} from '@angular/core';
import {Document, Message} from "../chat/message";
import {ConditionsUtil} from "../modules/utils/ConditionsUtil";
import {UserInstance, Users} from "../modules/user/user.instance";
import {DocumentComponent} from "./component";
import {ComponentService} from "./component.service";
import {MessageService} from "../chat/message.service";

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.less']
})
export class CreateComponent {
  @Output() endEditing = new EventEmitter<boolean>();
  users = Users;
  selectedUsers = [];
  isNewMessage: boolean = true;
  chatId: number = null;
  messages: Message[];

  constructor(private componentService: ComponentService,
              private messageService: MessageService) {
    this.messages = [];
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
          this.endEditing.emit(true);
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
}
