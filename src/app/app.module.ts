import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, Http } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { NgIdleModule } from '@ng-idle/core';

import { MyApp } from './app.component';

import { Accueil } from '../pages/accueil/accueil';
import { Maladie } from '../pages/formulaire/maladie/maladie';
import { TherapiesAlter } from '../pages/formulaire/therapies-alter/therapies-alter';
import { TraitementNom } from '../pages/formulaire/traitement-nom/traitement-nom';
import { Resultats } from '../pages/formulaire/resultats/resultats';
import { ResultatsErreur } from '../pages/formulaire/resultats-erreur/resultats-erreur';
import { Autocomplete } from '../pages/autocomplete/autocomplete';

import { Api } from '../providers/api';
import { Inactif } from '../providers/inactif';
import { Formulaire } from '../providers/formulaire';
import { LocalStockage } from '../providers/localstockage';
import { Diacritics } from '../providers/diacritics';
import { Traitement } from '../providers/traitement';
import { Cancer } from '../providers/cancer';
import { TherapieValidator } from '../providers/validators';

import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Keyboard } from '@ionic-native/keyboard';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// The translate loader needs to know where to load i18n files in Ionic's static asset pipeline.
export function HttpLoaderFactory(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    Accueil,
    Maladie,
    TherapiesAlter,
    TraitementNom,
    Resultats,
    ResultatsErreur,
    Autocomplete
  ],
  imports: [
    BrowserModule,
    HttpModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [Http]
      }
    }),
    NgIdleModule.forRoot(),
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Accueil,
    Maladie,
    TherapiesAlter,
    TraitementNom,
    Resultats,
    ResultatsErreur,
    Autocomplete
  ],
  providers: [
    Api,
    Inactif,
    Formulaire,
    LocalStockage,
    Diacritics,
    Traitement,
    Cancer,
    TherapieValidator,
    SplashScreen,
    StatusBar,
    Keyboard,
    // Keep this to enable Ionic's runtime error handling during development
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
