import {Component, OnDestroy} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {LanguageEnum} from "./modules/models/language.enum";
import {messaging, UserInstance} from "./modules/user/user.instance";
import {MessageService} from "./chat/message.service";

const appLanguageKey = "app-language";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnDestroy {
  defaultLanguage: LanguageEnum = LanguageEnum.English;
  translateSubscription;

  constructor(public translate: TranslateService,
              private messageService: MessageService) {
    translate.setDefaultLang(LanguageEnum.English);

    if (typeof(Storage) !== "undefined") {
      translate.use(
        localStorage.getItem(appLanguageKey) !== null ?
          localStorage.getItem(appLanguageKey) : this.defaultLanguage);

      localStorage.setItem(appLanguageKey, this.translate.currentLang);
    } else {
      translate.use(this.defaultLanguage);
    }

    this.translateSubscription = translate.onLangChange.subscribe(() => {
      localStorage.setItem(appLanguageKey, this.translate.currentLang);
    });

    navigator.serviceWorker.register('/assets/js/firebase-messaging-sw.js')
      .then((registration) => {
        messaging.useServiceWorker(registration);

        messaging.usePublicVapidKey("BDoGr4PZoGtUZksMBcYO3OuRADh1jFQRfbXt7VjgHUs_txvV3o3EkUd2gti88GPg_RWLs-x5v9V_6kmy2e8_-DA");
        messaging.requestPermission().then(() => {
          console.log('Notification permission granted.');

          messaging.getToken().then((currentToken) => {
            if (currentToken) {
              console.log(currentToken);
              this.messageService.registerPushToken({userId: UserInstance.id, token: currentToken}).subscribe();
            } else {
              // Show permission request.
              console.log('No Instance ID token available. Request permission to generate one.');
            }
          }).catch((err) => {
            console.log('An error occurred while retrieving token. ', err);
          });
        }).catch((err) => {
          console.log('Unable to get permission to notify.', err);
        });
      });

    messaging.onMessage((payload) => {
      console.log('Message received. ', payload);
    });
  }

  ngOnDestroy() {
    this.translateSubscription.unsubscribe();
  }
}
