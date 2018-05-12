import {
  AfterViewChecked, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output,
  ViewChild
} from '@angular/core';
import {PredictionService} from "./prediction.service";
import {ConditionsUtil} from "../modules/utils/ConditionsUtil";
import {LoaderService} from "../modules/loader/loader.service";
import {Document, DocumentReply, Message, MessageReply} from "./message";
import {messaging, UserInstance} from "../modules/user/user.instance";
import {User} from "../modules/user/user";
import {MessageService} from "./message.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs/Subscription";
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.less']
})
export class ChatComponent implements OnInit, AfterViewChecked, OnDestroy {
  @Input() chatId: number;
  @Input() isNew: boolean;
  @Input('messages')
  set messages(value: Message[]) {
    this._messages = value;
  }

  @Output() onMessage = new EventEmitter<string>();

  _messages: Message[];
  prediction: string;
  message: string;
  userInstance: User;
  autoRefresh: Subscription;

  constructor(private predictionService: PredictionService,
              private loader: LoaderService,
              public messageService: MessageService,
              public router: Router) {
    this.prediction = null;
    this.message = "";
    this.userInstance = UserInstance;

    //this.setAutoRefresh();

    messaging.onMessage((payload) => {
      console.log(this.messages);

      this.messageService.messages(this.chatId).subscribe(
        (messages) => {
          this.messages = messages;
        },
        error => console.log(error)
      );
    });
  }

  @ViewChild('scrollMe') private messagesContainer: ElementRef;

  private setAutoRefresh(): void {
    this.autoRefresh = Observable.interval(1000).subscribe(() => {
      if (ConditionsUtil.isNull(this.chatId)) {
        return;
      }

      this.messageService.messages(this.chatId).subscribe(
        (messages) => {
          this.messages = messages;
        },
        error => console.log(error)
      );
    });
  }

  ngOnDestroy(): void {
    if (ConditionsUtil.isNotNull(this.autoRefresh)) {
      this.autoRefresh.unsubscribe()
    }
  }

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
      if(this.isNew) {
        this.onMessage.emit(this.message);
        this.message = "";

        return;
      }

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
