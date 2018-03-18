import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Accueil } from '../../accueil/accueil';

@Component({
  selector: 'fin-formulaire',
  templateUrl: 'fin-formulaire.html'
})
export class FinFormulaire {

  timerCount: number = 15; //Fixe le temps avant que l'utilisateur soit redirigé vers la page d'accueil.
  succesForm: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams) { 
    this.succesForm = this.navParams.get('succesForm');
  }

  ngOnInit(){
    this.startTimer();
  }
    /**
   * Fonction qui permet de lancer le compte à rebours.
   * @method startTimer
   * @param {} - aucun paramètre n'est passé à la fonction.
   * @returns {} - aucune valeur n'est retournée par la fonction.
   */
    startTimer(){
      setTimeout(x => {
        if(this.timerCount <= 0) { 
          //Navigation à la page d'accueil du formulaire - Accueil
          this.navCtrl.push(Accueil);
        } else {
          this.timerCount -= 1;
          this.startTimer();
        }
      }, 1000);
    }

  /**
   * Fonction qui est liée au bouton "Retourner sur la page d'accueil" sur la page. 
   * Elle affiche la page d'accueil du formulaire - Accueil.
   * @method nextPage
   * @param {} - aucun paramètre n'est passé à la fonction.
   * @returns {} - aucune valeur n'est retournée par la fonction.
   */
  nextPage() {
    //Navigation à la page d'accueil du formulaire - Accueil
    this.navCtrl.push(Accueil);
  }
}
