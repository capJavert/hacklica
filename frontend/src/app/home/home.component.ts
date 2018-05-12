import { Component, OnInit } from '@angular/core';
import {BaseComponent} from "../modules/components/base.component";
import {HotkeysService} from "angular2-hotkeys";
import {NotificationService} from "../modules/notification/notification.service";
import {LoaderService} from "../modules/loader/loader.service";
import {MatDialog} from "@angular/material";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "./user.service";
import {Notification} from "./notification";
import {MessageService} from "../chat/message.service";
import {Message} from "../chat/message";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent extends BaseComponent implements OnInit {
  private _pinnedNotifications: Notification[];
  private _notifications: Notification[];
  messages: Message[];

  eventFilter: boolean = false;
  messageFilter: boolean = false;
  emailFilter: boolean = false;
  documentFilter: boolean = false;

  isEditing: boolean = false;
  document: any;
  emails = [];
  event: any;

  constructor(notificationService: NotificationService,
              _hotkeysService: HotkeysService,
              loader: LoaderService,
              dialog: MatDialog,
              router: Router,
              activatedRoute: ActivatedRoute,
              private userService: UserService,
              private messageService: MessageService,
              private sanitizer: DomSanitizer) {

    super(notificationService, _hotkeysService, loader, dialog, router, activatedRoute);

    this._notifications = [];
    this._pinnedNotifications = [];
  }

  get pinnedNotifications(): Notification[] {
    let filteredNotifications = [];

    if(this.eventFilter) {
      filteredNotifications.push(... this._pinnedNotifications.filter(obj => obj.type === "event"));
    }

    if(this.emailFilter) {
      filteredNotifications.push(... this._pinnedNotifications.filter(obj => obj.type === "email"));
    }

    if(this.messageFilter) {
      filteredNotifications.push(... this._pinnedNotifications.filter(obj => obj.type === "message"));
    }

    if(this.documentFilter) {
      filteredNotifications.push(... this._pinnedNotifications.filter(obj => obj.type === "document"));
    }

    if (filteredNotifications.length > 0) {
      return filteredNotifications;
    } else {
      return this._pinnedNotifications;
    }
  }

  get notifications(): Notification[] {
    let filteredNotifications = [];

    if(this.eventFilter) {
      filteredNotifications.push(... this._notifications.filter(obj => obj.type === "event"));
    }

    if(this.emailFilter) {
      filteredNotifications.push(... this._notifications.filter(obj => obj.type === "email"));
    }

    if(this.messageFilter) {
      filteredNotifications.push(... this._notifications.filter(obj => obj.type === "message"));
    }

    if(this.documentFilter) {
      filteredNotifications.push(... this._notifications.filter(obj => obj.type === "document"));
    }

    if (filteredNotifications.length > 0) {
      return filteredNotifications;
    } else {
      return this._notifications;
    }
  }

  ngOnInit() {
    this.loader.start();

    this.userService.notifications().subscribe(
      (notifications) => {
        this._pinnedNotifications = notifications.filter(obj => obj.pinned == true);
        this._notifications = notifications.filter(obj => obj.pinned == false);
      },
      error => this.handleError(error),
      () => this.loader.stop()
    );
  }

  openPanel(notification: Notification) {
    switch (notification.type) {
      case "message":
        this.messageService.messages(notification.id).subscribe(
          (messages) => {
            this.messages = messages;
          },
          error => console.log(error)
        );
        break;
      case "email":
        this.userService.email(notification.id).subscribe(
          (emails) => {
            this.emails = emails;
          },
          error => console.log(error)
        );
        break;
      case "event":
        this.userService.event(notification.id).subscribe(
          (event) => {
            this.event = event;
          },
          error => console.log(error)
        );
        break;
      case "document":
        this.userService.document(notification.id).subscribe(
          (document) => {
            this.document = document;
            this.document.document.path = this.sanitizer.bypassSecurityTrustResourceUrl(
              this.userService.base + '/' + this.document.document.path
            );
          },
          error => console.log(error)
        );
        break;
      default:
        console.log("unknown notification type");
    }

  }

  pin(componentId: number, event) {
    event.preventDefault();

    this.loader.start();

    this.userService.pin(componentId).subscribe(
      () => {
        this.userService.notifications().subscribe(
          (notifications) => {
            this._pinnedNotifications = notifications.filter(obj => obj.pinned == true);
            this._notifications = notifications.filter(obj => obj.pinned == false);
          },
          error => this.handleError(error),
          () => this.loader.stop()
        );
      },
      error => {
          this.handleError(error);
          this.loader.stop()
        },
      );
  }

  unpin(componentId: number, event) {
    event.preventDefault();

    this.loader.start();

    this.userService.unpin(componentId).subscribe(
      () => {
        this.userService.notifications().subscribe(
          (notifications) => {
            this._pinnedNotifications = notifications.filter(obj => obj.pinned == true);
            this._notifications = notifications.filter(obj => obj.pinned == false);
          },
          error => this.handleError(error),
          () => this.loader.stop()
        );
      },
      error => {
        this.handleError(error);
        this.loader.stop()
      },
    );
  }

  hide(componentId: number, event) {
    this.loader.start();

    this.userService.hide(componentId).subscribe(
      () => {
        this.userService.notifications().subscribe(
          (notifications) => {
            this._pinnedNotifications = notifications.filter(obj => obj.pinned == true);
            this._notifications = notifications.filter(obj => obj.pinned == false);
          },
          error => this.handleError(error),
          () => this.loader.stop()
        );
      },
      error => {
        this.handleError(error);
        this.loader.stop()
      },
    );
  }

  create() {
    this.isEditing = !this.isEditing;
  }

  endEditing() {
    this.isEditing = false;

    this.loader.start();

    this.userService.notifications().subscribe(
      (notifications) => {
        this._pinnedNotifications = notifications.filter(obj => obj.pinned == true);
        this._notifications = notifications.filter(obj => obj.pinned == false);
      },
      error => this.handleError(error),
      () => this.loader.stop()
    );
  }
}
