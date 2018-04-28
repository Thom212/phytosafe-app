import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

//page suivante
import { Maladie } from '../formulaire/maladie/maladie';
import { RaisonRefusFormulaire } from '../formulaire/raison-refus-formulaire/raison-refus-formulaire';

//providers
import { Formulaire } from '../../providers/formulaire';
import { LocalStockage } from '../../providers/localstockage';

@Component({
  selector: 'accueil',
  templateUrl: 'accueil.html'
})
export class Accueil {

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public formulaire: Formulaire, public localstockage: LocalStockage, private geolocation: Geolocation) {}
  
  /**
   * Fonction qui permet de fixer le centre.
   * Elle ouvre une page modale pour sélectionner le centre.
   * Une fois la valeur choisie, elle la stocke localement.
   * @method setCenter
   * @requires providers/localstockage - la fonction utilise la méthode setData.
   * @param {} - aucun paramètre n'est passé à la fonction.
   * @returns {} - aucune valeur n'est retournée par la fonction.
   */
  setCenter() {
    this.localstockage.getData("setCenter").then((val)=> {
      //Création de la page modale
      let centerModal = this.modalCtrl.create(Center, {centerData : val});
      //Traitements lors de la fermeture de la page d'autocompletion
      centerModal.onDidDismiss(data => {
        this.localstockage.setData(data)
      });
      //Affichage de la page d'autocompletion
      centerModal.present();
    });
  }

  /**
   * Fonction appelée lors du clic sur le bouton "Commencer le formulaire" sur la page d'accueil.
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
    interface dateObjet { dateForm: Date, accordForm: Boolean};
    var currentTime = new Date();
    var dateCreaForm: dateObjet = {dateForm : currentTime, accordForm : true};

    //Coordonnées GPS du patient
    interface coordObjet {latitudeForm: Number, longitudeForm: Number};
    var coordForm: coordObjet = {latitudeForm : null, longitudeForm : null};

    //Récupération des coordonnées GPS du device
    this.geolocation.getCurrentPosition().then((resp) => {
      coordForm.latitudeForm = resp.coords.latitude;
      coordForm.longitudeForm = resp.coords.longitude;
      //Enregistrement des données (coordonnées GPS) localement
      this.localstockage.setData(coordForm);
    }).catch((error) => {
       console.log('Error getting location', error);
    });

    //Suppression du serveur des formulaires qui n'ont pas été terminés
    this.localstockage.getData("idForm").then((val)=> {
      if (val!==null){
        this.formulaire.removeForm(val);
      }
    });

    //Stockage local de la date de création du nouveau formulaire après avoir supprimer toutes les données déjà stockées
    //Suppression des données stockées localement qui n'ont pas été envoyées sur le serveur et dont le formulaire est considéré comme non terminé
    this.localstockage.clearAllData().then(()=>{
      //Récupération des formulaires terminés mais non envoyés sur le serveur
      this.localstockage.getStoreData().then((dataStore) => {
        for(var propertyName in dataStore) {
          let data = JSON.parse(dataStore[propertyName]);
          //Si l'identifiant du formulaire (ideForm) n'existe pas, le formulaire n'a pas été créé côté serveur
          if(data.idForm == null){
            //Dans ce cas, il faut le créer côté serveur
            this.formulaire.createForm(data).toPromise().then((res) => {
              //Suppression du formulaire qui vient d'être envoyé sur le serveur
              this.localstockage.clearData(propertyName);
            }).catch((err)=>{
              console.error('ERROR', err);
            });
          //Si l'identifiant du formulaire (idForm) existe, le formulaire a été créé côté serveur
          } else {
            //Dans ce cas, il faut le mettre à jour côté serveur
            this.formulaire.updateForm(data).toPromise().then((res) => {
              //Suppression du formulaire qui vient d'être envoyé sur le serveur
              this.localstockage.clearData(propertyName);
            }).catch((err)=>{
              console.error('ERROR', err);
            });
          }
          break;
        }
      });

      //Création du formulaire
      this.localstockage.setData(dateCreaForm).then((message) => {
        this.localstockage.getAllData().then((dataForm)=>{
          this.formulaire.createForm(dataForm);
        });
      });
      
      //Navigation à la page du formulaire - Maladie
      this.navCtrl.push(Maladie);
    });
  }

  /**
   * Fonction appelée lors du clic sur le bouton "Refuser le formulaire" sur la page d'accueil.
   * Elle récupère la date et l'heure au moment où le bouton est cliqué et stocke cette valeur localement.
   * Une fois cette valeur stockée, elle crée un nouveau formulaire et affiche la page du formulaire - Refus formulaire.
   * @method refusPage
   * @requires providers/localstockage - la fonction utilise la méthode setData.
   * @requires providers/formulaire - la fonction utilise la méthode createForm.
   * @param {} - aucun paramètre n'est passé à la fonction.
   * @returns {} - aucune valeur n'est retournée par la fonction.
   */
  refusPage() {
    //Date de création du nouveau formulaire
    interface dateObjet { dateForm: Date, accordForm: Boolean};
    var currentTime = new Date();
    var dateCreaForm: dateObjet = {dateForm : currentTime, accordForm : true};

    //Coordonnées GPS du patient
    interface coordObjet {latitudeForm: Number, longitudeForm: Number};
    var coordForm: coordObjet = {latitudeForm : null, longitudeForm : null};

    //Récupération des coordonnées GPS du device
    this.geolocation.getCurrentPosition().then((resp) => {
      coordForm.latitudeForm = resp.coords.latitude;
      coordForm.longitudeForm = resp.coords.longitude;
      //Enregistrement des données (coordonnées GPS) localement
      this.localstockage.setData(coordForm);
    }).catch((error) => {
       console.log('Error getting location', error);
    });

    //Suppression du serveur des formulaires qui n'ont pas été terminés
    this.localstockage.getData("idForm").then((val)=> {
      if (val!==null){
        this.formulaire.removeForm(val);
      }
    });

    //Stockage local de la date de création du nouveau formulaire après avoir supprimer toutes les données déjà stockées
    //Suppression des données stockées localement qui n'ont pas été envoyées sur le serveur et dont le formulaire est considéré comme non terminé
    this.localstockage.clearAllData().then(()=>{
      //Récupération des formulaires terminés mais non envoyés sur le serveur
      this.localstockage.getStoreData().then((dataStore) => {
        for(var propertyName in dataStore) {
          let data = JSON.parse(dataStore[propertyName]);
          //Si l'identifiant du formulaire (ideForm) n'existe pas, le formulaire n'a pas été créé côté serveur
          if(data.idForm == null){
            //Dans ce cas, il faut le créer côté serveur
            this.formulaire.createForm(data).toPromise().then((res) => {
              //Suppression du formulaire qui vient d'être envoyé sur le serveur
              this.localstockage.clearData(propertyName);
            }).catch((err)=>{
              console.error('ERROR', err);
            });
          //Si l'identifiant du formulaire (idForm) existe, le formulaire a été créé côté serveur
          } else {
            //Dans ce cas, il faut le mettre à jour côté serveur
            this.formulaire.updateForm(data).toPromise().then((res) => {
              //Suppression du formulaire qui vient d'être envoyé sur le serveur
              this.localstockage.clearData(propertyName);
            }).catch((err)=>{
              console.error('ERROR', err);
            });
          }
          break;
        }
      });

      //Création du formulaire
      this.localstockage.setData(dateCreaForm).then((message) => {
        this.localstockage.getAllData().then((dataForm)=>{
          this.formulaire.createForm(dataForm);
        });
      });

      //Navigation à la page du formulaire - Refus formulaire
      this.navCtrl.push(RaisonRefusFormulaire);
    });
  }
}
