//Modules auto-générés à la création de l'application 
import { NgModule, ErrorHandler, Injectable, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, Http } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';

//Modules importés
import { IonicStorageModule } from '@ionic/storage';
import { NgIdleModule } from '@ng-idle/core';
import { Keyboard } from '@ionic-native/keyboard';
import { Geolocation } from '@ionic-native/geolocation';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
// The translate loader needs to know where to load i18n files in Ionic's static asset pipeline.
export function HttpLoaderFactory(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

//Pages créées pour l'application
import { Accueil } from '../pages/accueil/accueil';
import { Maladie } from '../pages/formulaire/maladie/maladie';
import { Therapies } from '../pages/formulaire/therapies/therapies';
import { TherapiesAlter } from '../pages/formulaire/therapies-alter/therapies-alter';
import { TraitementNom } from '../pages/formulaire/traitement-nom/traitement-nom';
import { Aliments } from '../pages/formulaire/aliments/aliments';
import { InfoPerso } from '../pages/formulaire/info-perso/info-perso';
import { FinFormulaire } from '../pages/formulaire/fin-formulaire/fin-formulaire';
import { RaisonRefusFormulaire } from '../pages/formulaire/raison-refus-formulaire/raison-refus-formulaire';
import { RefusFormulaire } from '../pages/formulaire/refus-formulaire/refus-formulaire';
import { Autocomplete } from '../pages/autocomplete/autocomplete';
import { Center } from '../pages/center/center';

//Modules créés pour l'application (providers)
import { Api } from '../providers/api';
import { Inactif } from '../providers/inactif';
import { Formulaire } from '../providers/formulaire';
import { LocalStockage } from '../providers/localstockage';
import { Diacritics } from '../providers/diacritics';
import { Traitement } from '../providers/traitement';
import { Cancer } from '../providers/cancer';
import { TherapieValidator } from '../providers/validators';

// Module importé pour Pro Client avec Monitoring & Deploy,
import { Pro } from '@ionic/pro';

Pro.init('0176cb0d', {
  appVersion: '0.0.1'
})

@Injectable()
export class MyErrorHandler implements ErrorHandler {
  ionicErrorHandler: IonicErrorHandler;

  constructor(injector: Injector) {
    try {
      this.ionicErrorHandler = injector.get(IonicErrorHandler);
    } catch(e) {
      // Unable to get the IonicErrorHandler provider, ensure
      // IonicErrorHandler has been added to the providers list below
    }
  }

  handleError(err: any): void {
    Pro.monitoring.handleNewError(err);
    // Remove this if you want to disable Ionic's auto exception handling
    // in development mode.
    this.ionicErrorHandler && this.ionicErrorHandler.handleError(err);
  }
}

@NgModule({
  declarations: [
    MyApp,
    Accueil,
    Maladie,
    Therapies,
    TherapiesAlter,
    TraitementNom,
    Aliments,
    InfoPerso,
    FinFormulaire,
    RaisonRefusFormulaire,
    RefusFormulaire,
    Autocomplete,
    Center
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
    Therapies,
    TherapiesAlter,
    TraitementNom,
    Aliments,
    InfoPerso,
    FinFormulaire,
    RaisonRefusFormulaire,
    RefusFormulaire,
    Autocomplete,
    Center
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
    Geolocation,
    IonicErrorHandler,
    [{ provide: ErrorHandler, useClass: MyErrorHandler }]
  ]
})
export class AppModule { }
