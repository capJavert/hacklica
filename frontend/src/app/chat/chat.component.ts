import {AfterViewChecked, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {PredictionService} from "./prediction.service";
import {ConditionsUtil} from "../modules/utils/ConditionsUtil";
import {LoaderService} from "../modules/loader/loader.service";
import {Document, DocumentReply, Message, MessageReply} from "./message";
import {UserInstance} from "../modules/user/user.instance";
import {User} from "../modules/user/user";
import {MessageService} from "./message.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.less']
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @Input() chatId: number;
  @Input('messages')
  set messages(value: Message[]) {
    this._messages = value;
  }

  _messages: Message[];
  prediction: string;
  message: string;
  userInstance: User;

  constructor(private predictionService: PredictionService,
              private loader: LoaderService,
              private messageService: MessageService) {
    this.prediction = null;
    this.message = "";
    this.userInstance = UserInstance;
  }

  @ViewChild('scrollMe') private messagesContainer: ElementRef;

  ngOnInit() {
    this.scrollToBottom();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  get messages(): Message[] {
    return this._messages;
  }

  predict(event) {
    const code = event.keyCode || event.which;
    if (code == '9') {
      event.preventDefault();

      this.message = this.prediction;
      this.prediction = null;

      return;
    }

    if (this.message.split(" ").length < 4 || this.loader.isLoading) {
      return;
    }

    this.prediction = null;

    this.loader.start();

    this.predictionService.search(this.message).subscribe(
      (response) => {
        if (ConditionsUtil.isNotNull(response)) {
          console.log(response.search);
          this.prediction = response.search;
        }
      },
      error => console.log(error),
      () => this.loader.stop()
    );
  }

  messageReply(event) {
    const code = event.keyCode || event.which;
    if (code != '13') {
      return;
    }

    if (ConditionsUtil.isNotNullNorEmpty(this.message)) {
      this.loader.start();

      let newMessage = new MessageReply();
      newMessage.componentId = this.chatId;
      newMessage.userId = this.userInstance.id;
      newMessage.message = this.message;

      this.messageService.send(newMessage).subscribe(
        (message) => {
          this.message = "";
          this.messages.push(message);
        },
        error => console.log(error),
        () => this.loader.stop()
      )
    }
  }

  uploadFile(document: Document) {
    if (ConditionsUtil.isNotNullNorEmpty(document)) {
      let newMessage = new DocumentReply();
      newMessage.componentId = this.chatId;
      newMessage.userId = this.userInstance.id;
      newMessage.message = this.message;
      newMessage.document = document;

      this.messageService.upload(newMessage).subscribe(
        (message) => {
          this.message = "";
          this.messages.push(message);
        },
        error => console.log(error),
        () => this.loader.stop()
      )
    }
  }
}
