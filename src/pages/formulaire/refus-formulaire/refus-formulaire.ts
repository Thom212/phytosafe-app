import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Accueil } from '../../accueil/accueil';

@Component({
  selector: 'refus-formulaire',
  templateUrl: 'refus-formulaire.html'
})
export class RefusFormulaire {

  timerCount: number = 15; //Fixe le temps avant que l'utilisateur soit redirigé vers la page d'accueil.
  timer : any;
  succesForm: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

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
      this.timer = setTimeout(x => {
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
    clearTimeout(this.timer);
    //Navigation à la page d'accueil du formulaire - Accueil
    this.navCtrl.push(Accueil);
  }
}
