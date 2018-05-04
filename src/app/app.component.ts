import { Component} from '@angular/core';
import { Platform } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { Accueil } from '../pages/accueil/accueil';

import { TranslateService } from '@ngx-translate/core';

@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {
  rootPage = Accueil;

  constructor(private translate: TranslateService, private platform: Platform, private statusBar: StatusBar, private splashScreen: SplashScreen, private storage: Storage) {
    this.initTranslate();
    this.platform.ready().then(() => {
      this.storage.ready().then(()=>{
        this.statusBar.styleDefault();
        this.splashScreen.hide();
      });
    });
  }

  initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('fr');

    if (this.translate.getBrowserLang() !== undefined) {
      this.translate.use(this.translate.getBrowserLang());
    } else {
      this.translate.use('fr'); // Set your language here
    }
  }
}
