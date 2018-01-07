import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit} from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController} from 'ionic-angular';

import { TranslateService } from '@ngx-translate/core';

import { Formulaire } from '../../../providers/formulaire';
import { LocalStockage } from '../../../providers/localstockage';

@Component({
  selector: 'resultats-erreur',
  templateUrl: 'resultats-erreur.html'
})
export class ResultatsErreur implements OnInit {

  resultatsForm: FormGroup;
  submitAttempt: boolean = false;
  networkCheck: boolean;
  textError: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public formBuilder: FormBuilder,public translate: TranslateService, public localstockage: LocalStockage, public formulaire: Formulaire) {
    this.resultatsForm = formBuilder.group({
      emailForm: ['', Validators.pattern('(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)')],
    });
    this.networkCheck = this.navParams.get('networkCheck');
  }

  ngOnInit(){
    if (this.networkCheck === true) {
      this.translate.get('ERROR_NETWORK_RESULTAT').subscribe(value => {
        this.textError = value;
      });
    } else {
      this.translate.get('ERROR_CONNECTION_RESULTAT').subscribe(value => {
        this.textError = value;
      });
    }
  }

  /**
   * Fonction qui est liée au bouton "Terminé" sur la page de résultats du formulaire - Resultats-erreur.
   * Elle regarde si l'adresse email a été renseignée. Si elle n'a pas été renseignée, une confirmation est demandée.
   * @method nextPage
   * @param {} - aucun paramètre n'est passé à la fonction.
   * @returns {} - aucune valeur n'est retournée par la fonction.
   */
  nextPage() {
    if (this.resultatsForm.valid) {
      this.finalOperPatient();
    } else {
      let alert = this.alertCtrl.create({
        title: 'Attention !!',
        message: 'Vous allez être redirigé vers la page d\'accueil sans que les informations du formulaire ne vous aient été envoyées par email. Voulez-vous continuer ?',
        buttons: [
          {
            text: 'Non',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Oui',
            handler: () => {
              console.log('Buy clicked');
              this.finalOperNoPatient();
            }
          }
        ]
      });
    alert.present();
    }
  }

  /**
   * Fonction qui est liée au bouton "Terminé" sur la page de résultats du formulaire - Resultats-erreur.
   * Elle effectue toutes les opérations nécessaires pour mettre à jour la base de donnée et les données stockées localement.
   * Cette fonction n'est activée que si l'utilisateur a renseigné son adresse email.
   * Elle affiche ensuite la page d'accueil du formulaire - Accueil.
   * @method finalOperPatient
   * @requires providers/localstockage - la fonction utilise les méthodes setData, getData, getAllData.
   * @requires providers/formulaire - la fonction utilise les méthodes createForm et updateForm.
   * @param {} - aucun paramètre n'est passé à la fonction.
   * @returns {} - aucune valeur n'est retournée par la fonction.
   */
  finalOperPatient() {
    this.submitAttempt = true;
    let loader = this.loadingCtrl.create({
      content: "Redirection vers la page d'acceuil. Cette opération peut prendre quelques temps. Veuillez patienter..."
    });
    loader.present();
    //Stockage local des données remplies dans cette page de formulaire
    this.localstockage.setData(this.resultatsForm.value).then((message) => {
      console.log('Email : ' + message);
      //Mise à jour/création du formulaire sur le serveur avec les données entrées sur cette page du formulaire
      this.localstockage.getData("idForm").then((val)=> {
        this.localstockage.getAllData().then((dataForm)=>{
          //il faut créer/mettre à jour le formulaire avec toutes les données stockées
          if (val==null){
            //Si le formulaire n'a pas été créé, il faut le créer
            this.formulaire.createForm(dataForm).toPromise().then((res) => {
              this.formulaire.createPatient(dataForm).toPromise().then((res) => {
                loader.dismiss();
                //Navigation à la page d'accueil du formulaire - Accueil
                this.navCtrl.popToRoot();
              }).catch((err)=>{
                console.error('ERROR', err);
              });
            }).catch((err)=>{
              console.error('ERROR', err);
              this.localstockage.storeAllData(dataForm);
              loader.dismiss();
              //Navigation à la page d'accueil du formulaire - Accueil
              this.navCtrl.popToRoot();
            });
          } else {
            //Sinon, il faut le mettre à jour
            this.formulaire.updateForm(dataForm).toPromise().then((res) => {
              this.formulaire.createPatient(dataForm).toPromise().then((res) => {
                loader.dismiss();
                //Navigation à la page d'accueil du formulaire - Accueil
                this.navCtrl.popToRoot();
              }).catch((err)=>{
                console.error('ERROR', err);
              });
            }).catch((err)=>{
              console.error('ERROR', err);
              this.localstockage.storeAllData(dataForm);
              loader.dismiss();
              //Navigation à la page d'accueil du formulaire - Accueil
              this.navCtrl.popToRoot();
            });
          }
        });
      });
    });
  }

    /**
   * Fonction qui est liée au bouton "Terminé" sur la page de résultats du formulaire - Resultats-erreur.
   * Elle effectue toutes les opérations nécessaires pour mettre à jour la base de donnée et les données stockées localement.
   * Cette fonction n'est activée que si l'utilisateur a renseigné son adresse email.
   * Elle affiche ensuite la page d'accueil du formulaire - Accueil.
   * @method finalOperNoPatient
   * @requires providers/localstockage - la fonction utilise les méthodes setData, getData, getAllData.
   * @requires providers/formulaire - la fonction utilise les méthodes createForm et updateForm.
   * @param {} - aucun paramètre n'est passé à la fonction.
   * @returns {} - aucune valeur n'est retournée par la fonction.
   */
  finalOperNoPatient() {
    this.submitAttempt = true;
    let loader = this.loadingCtrl.create({
      content: "Redirection vers la page d'acceuil. Veuillez patienter..."
    });
    loader.present();
    //Stockage local des données remplies dans cette page de formulaire
    this.localstockage.setData(this.resultatsForm.value).then((message) => {
      console.log('Email : ' + message);
      //Mise à jour/création du formulaire sur le serveur avec les données entrées sur cette page du formulaire
      this.localstockage.getData("idForm").then((val)=> {
        this.localstockage.getAllData().then((dataForm)=>{
          //il faut créer/mettre à jour le formulaire avec toutes les données stockées
          if (val==null){
            //Si le formulaire n'a pas été créé, il faut le créer
            this.formulaire.createForm(dataForm).toPromise().then((res) => {
              loader.dismiss();
              //Navigation à la page d'accueil du formulaire - Accueil
              this.navCtrl.popToRoot();
            }).catch((err)=>{
              console.error('ERROR', err);
              this.localstockage.storeAllData(dataForm);
              loader.dismiss();
              //Navigation à la page d'accueil du formulaire - Accueil
              this.navCtrl.popToRoot();
            });
          } else {
            //Sinon, il faut le mettre à jour
            this.formulaire.updateForm(dataForm).toPromise().then((res) => {
              loader.dismiss();
              //Navigation à la page d'accueil du formulaire - Accueil
              this.navCtrl.popToRoot();
            }).catch((err)=>{
              console.error('ERROR', err);
              this.localstockage.storeAllData(dataForm);
              loader.dismiss();
              //Navigation à la page d'accueil du formulaire - Accueil
              this.navCtrl.popToRoot();
            });
          }
        });
      });
    });
  }
}