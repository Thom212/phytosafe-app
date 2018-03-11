import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {Idle, DEFAULT_INTERRUPTSOURCES} from '@ng-idle/core';
import { TranslateService } from '@ngx-translate/core';

import { Formulaire } from './formulaire';
import { LocalStockage } from './localstockage';

/**
 * @class Inactif - Ce service permet de vérifier si l'utilisateur est actif ou pas, et le cas échéant de le renvoyer vers la page d'accueil du formulaire.
 */

@Injectable()
export class Inactif {

  idleCount: number = 15; //Fixe le temps avant que l'utilisateur, une fois inactif, soit redirigé vers la page d'accueil.
  idleState: any;

  constructor(public translate: TranslateService, private idle: Idle, public localstockage: LocalStockage, public formulaire: Formulaire) {
    // Temps à partir duquel on estime que l'utilisateur est inactif.
    idle.setIdle(5);
    // Actions qui terminent l'inactivité.
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
  }

  /**
   * Méthode qui lance la détection de l'inactivité de l'utilisateur, et qui, une fois l'inactivité détectée, ouvre une fenêtre d'alerte. 
   * @method idleSet
   * @requires providers/inactif - la fonction utilise la méthode idleRedirectConfirm.
   * @param {Controller, Controller} - les deux controlleurs, qui correspondent à la page sur laquelle l'utilisateur est présent et à la fenêtre d'alerte sont passées à la méthode.
   * @returns {} - aucune valeur n'est retournée par la méthode.
   */
  idleSet(navCtrl,alertCtrl) {
    this.idle.watch();
    this.idleState = this.idle.onIdleStart.subscribe(()=>this.idleRedirectConfirm(navCtrl,alertCtrl));
  }

  /**
   * Méthode qui lance un timer.
   * @method idleTimer
   * @param {} - aucun paramètre n'est passé à la fonction.
   * @returns {Observable} - un observable est renvoyé pour suivre l'état du timer.
   */
  idleTimer(){  
    return Observable.timer(0,1000);
  }

  /**
   * Méthode qui ouvre une fenêtre d'alerte pour informer à l'utilisateur qu'il est inactif. 
   * L'utilisateur peut soit confirmer la redirection vers la redirection vers la page d'accueil, soit l'annuler, soit attendre qu'il soit redirigé au terme d'un compte à rebours.
   * La redirection s'accompagne d'une suppression de toutes les données stockées localement.
   * @method idleRedirectConfirm
   * @requires providers/inactif - la fonction utilise la méthode idleSet, idleTimer.
   * @requires providers/localstockage - la fonction utilise la méthode clearAllData.
   * @param {Controller, Controller} - les deux controlleurs, qui correspondent à la page sur laquelle l'utilisateur est présent et à la fenêtre d'alerte sont passées à la méthode.
   * @returns {} - aucune valeur n'est retournée par la méthode.
   */
  idleRedirectConfirm(navCtrl,alertCtrl) {
    //Arrêt de la détection de l'inactivité de l'utilisateur
    this.idleState.unsubscribe();
    this.idle.stop();

    //Création de la fenêtre d'alerte
    let buttonTextConfirm: string;
    let buttonTextCancel: string;
    this.translate.get('BOUTON_CONFIRM_ALERTE').subscribe(value => {
      buttonTextConfirm = value;
    });
    this.translate.get('BOUTON_ANNUL_ALERTE').subscribe(value => {
      buttonTextCancel = value;
    });

    let alert = alertCtrl.create({
      title: '',
      subTitle: '',
      message: '',
      cssClass: 'idleCss',
      buttons: [
        {
          text: buttonTextConfirm,
          handler: () =>{ 
            timer.unsubscribe();
            alert.dismiss().then(() => {
              this.localstockage.getData("idForm").then((val)=> {
                if (val!==null){
                  //Si le formulaire n'a pas été créé, il faut le créer
                  this.formulaire.removeForm(val);
                }
              });
              navCtrl.popToRoot();
            });
            return false;//La fermeture de l'alerte est faite manuellement, par alert.dismiss(), une fois la suppression des données effectuées.
          }
        },
        {
          text: buttonTextCancel,
          role: 'cancel',
          handler: () =>{
            //Relance de la détection de l'inactivité de l'utilisateur
            this.idleSet(navCtrl,alertCtrl);
            timer.unsubscribe();
          }
        }
      ]
    });
    let titre: string;
    let message: string;
    this.translate.get('TITRE_ALERTE').subscribe(value => {
      titre = value;
    });
    this.translate.get('MESSAGE_ALERTE').subscribe(value => {
      message = value;
    });
    alert.setTitle(titre);
    alert.setMessage(message);
    //Création d'un compte à rebours qui, une fois à zéro, redirige l'utilisateur vers la page d'accueil du formulaire
    let timer = this.idleTimer().subscribe((t)=>{
      let count = this.idleCount-t;
      if (count>=0){
        let sousTitrePrinc: string;
        let sousTitreUnit: string;
        this.translate.get('SOUSTITRE_ALERTE').subscribe(value => {
          sousTitrePrinc = value;
        });
        this.translate.get('SOUSTITRE_UNIT_ALERTE').subscribe(value => {
          sousTitreUnit = value;
        });
        alert.setSubTitle(sousTitrePrinc + count + sousTitreUnit);
      } else {
        timer.unsubscribe();
        alert.dismiss().then(() => {
          this.localstockage.getData("idForm").then((val)=> {
            if (val!==null){
              //Si le formulaire n'a pas été créé, il faut le créer
              this.formulaire.removeForm(val);
            }
          });
          navCtrl.popToRoot();
        });
      }
    });
    
    alert.present();
  }
}
