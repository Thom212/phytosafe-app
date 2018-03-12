import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Maladie } from '../formulaire/maladie/maladie';

import { Formulaire } from '../../providers/formulaire';
import { LocalStockage } from '../../providers/localstockage';

@Component({
  selector: 'accueil',
  templateUrl: 'accueil.html'
})
export class Accueil {

  constructor(public navCtrl: NavController, public formulaire: Formulaire, public localstockage: LocalStockage) {}
  
  /**
   * Fonction qui est liée au bouton "Commencer le formulaire" sur la page d'accueil.
   * Elle récupère la date et l'heure au moment où le bouton est cliqué et stocke cette valeur localement. 
   * Une fois cette valeur stockée, elle crée un nouveau formulaire et affiche la première page du formulaire - Données Personnelles.
   * @method nextPage
   * @requires providers/localstockage - la fonction utilise la méthode setData.
   * @requires providers/formulaire - la fonction utilise la méthode createForm.
   * @param {} - aucun paramètre n'est passé à la fonction.
   * @returns {} - aucune valeur n'est retournée par la fonction.
   */
  nextPage() {
    //Date de création du nouveau formulaire
    interface dateObjet { dateForm: Date };
    var currentTime = new Date();
    var dateCreaForm: dateObjet = {dateForm : currentTime};

    this.localstockage.getData("idForm").then((val)=> {
      console.log(val);
      if (val!==null){
        this.formulaire.removeForm(val);
      }
    });

    //Stockage local de la date de création du nouveau formulaire après avoir supprimer toutes les données déjà stockées
    this.localstockage.clearAllData().then(()=>{
      this.localstockage.getStoreData().then((dataStore) => {
        for(var propertyName in dataStore) {
          let data = JSON.parse(dataStore[propertyName]);
          if(data.idForm == null){
            //Si le formulaire n'a pas été créé, il faut le créer
            this.formulaire.createForm(data).toPromise().then((res) => {
              //Suppression du formulaire qui vient d'être envoyé sur le serveur
              this.localstockage.clearStoreData(propertyName);
            }).catch((err)=>{
              console.error('ERROR', err);
            });
          } else {
            //Sinon, il faut le mettre à jour
            this.formulaire.updateForm(data).toPromise().then((res) => {
              //Suppression du formulaire qui vient d'être envoyé sur le serveur
              this.localstockage.clearStoreData(propertyName);
            }).catch((err)=>{
              console.error('ERROR', err);
            });
          }
          break;
        }
      });
      this.localstockage.setData(dateCreaForm).then((message) => {
        console.log('Date de création du formulaire : ' + message);
        //Création d'un nouveau formulaire. La première donnée à entrer dans le formulaire est la date de création.
        this.formulaire.createForm(dateCreaForm);
        //Navigation à la page du formulaire - Maladie
        this.navCtrl.push(Maladie);
      });
    });
  }
}
