import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { TranslateService } from '@ngx-translate/core';

//page suivante
import { Maladie } from '../formulaire/maladie/maladie';
import { RaisonRefusFormulaire } from '../formulaire/raison-refus-formulaire/raison-refus-formulaire';

//page center
import{ Center } from '../center/center';

//providers
import { Formulaire } from '../../providers/formulaire';
import { LocalStockage } from '../../providers/localstockage';

@Component({
  selector: 'accueil',
  templateUrl: 'accueil.html'
})
export class Accueil {

  center1: string;
  center2: string;
  center3: string;
  center4: string;
  center5: string;
  center6: string;
  center7: string;
  center8: string;
  center9: string;
  center10: string;
  center11: string;
  center12: string;
  center13: string;
  center14: string;
  titreCenter: string;

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public translate: TranslateService, public formulaire: Formulaire, public localstockage: LocalStockage, private geolocation: Geolocation) {
    this.translate.get('OPTION_CENTER_1').subscribe(value => {
      this.center1 = value;
    });
    this.translate.get('OPTION_CENTER_2').subscribe(value => {
      this.center2 = value;
    });
    this.translate.get('OPTION_CENTER_3').subscribe(value => {
      this.center3 = value;
    });
    this.translate.get('OPTION_CENTER_4').subscribe(value => {
      this.center4 = value;
    });
    this.translate.get('OPTION_CENTER_5').subscribe(value => {
      this.center5 = value;
    });
    this.translate.get('OPTION_CENTER_6').subscribe(value => {
      this.center6 = value;
    });
    this.translate.get('OPTION_CENTER_7').subscribe(value => {
      this.center7 = value;
    });
    this.translate.get('OPTION_CENTER_8').subscribe(value => {
      this.center8 = value;
    });
    this.translate.get('OPTION_CENTER_9').subscribe(value => {
      this.center9 = value;
    });
    this.translate.get('OPTION_CENTER_10').subscribe(value => {
      this.center10 = value;
    });
    this.translate.get('OPTION_CENTER_11').subscribe(value => {
      this.center11 = value;
    });
    this.translate.get('OPTION_CENTER_12').subscribe(value => {
      this.center12 = value;
    });
    this.translate.get('OPTION_CENTER_13').subscribe(value => {
      this.center13 = value;
    });
    this.translate.get('OPTION_CENTER_14').subscribe(value => {
      this.center14 = value;
    });
    this.translate.get('TITRE_MODAL_CENTER').subscribe(value => {
      this.titreCenter = value;
    });
  }
  
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
      let centerPicked: string;
      if (val==null){
        centerPicked = '';
      } else {
        centerPicked = val;
      }
      let centerModal = this.modalCtrl.create(Center,{centerList: [this.center1, this.center2, this.center3, this.center4, this.center5, this.center6, this.center7, this.center8, this.center9, this.center10, this.center11, this.center12, this.center13, this.center14], titreModalCenter: this.titreCenter, centerModalPicked: centerPicked});
      //Affichage de la page du choix du centre
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
      //Date de création du nouveau formulaire
      interface dateObjet { dateForm: Date, accordForm: Boolean, centerForm: string};
      var currentTime = new Date();
      var dateCreaForm: dateObjet;
      this.localstockage.getData("setCenter").then((val)=> {
        dateCreaForm = {dateForm : currentTime, accordForm : true, centerForm: val};
        //Création du formulaire
        this.localstockage.setData(dateCreaForm).then((message) => {
          this.localstockage.getAllData().then((dataForm)=>{
            this.formulaire.createForm(dataForm);
          });
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

      //Date de création du nouveau formulaire
      interface dateObjet { dateForm: Date, accordForm: Boolean, centerForm: string};
      var currentTime = new Date();
      var dateCreaForm: dateObjet;
      this.localstockage.getData("setCenter").then((val)=> {
        dateCreaForm = {dateForm : currentTime, accordForm : false, centerForm: val};
        //Création du formulaire
        this.localstockage.setData(dateCreaForm).then((message) => {
          this.localstockage.getAllData().then((dataForm)=>{
            this.formulaire.createForm(dataForm);
          });
        });
      });

      //Navigation à la page du formulaire - Refus formulaire
      this.navCtrl.push(RaisonRefusFormulaire);
    });
  }
}
