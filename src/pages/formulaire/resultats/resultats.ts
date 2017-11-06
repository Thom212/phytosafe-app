import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit} from '@angular/core';
import { NavController} from 'ionic-angular';
import { Network } from '@ionic-native/network';

import { TranslateService } from '@ngx-translate/core';

import { Formulaire } from '../../../providers/formulaire';
import { LocalStockage } from '../../../providers/localstockage';
import { Incompatibilite } from '../../../providers/incompatibilite';

@Component({
  selector: 'resultats',
  templateUrl: 'resultats.html'
})
export class Resultats implements OnInit {

  resultatsForm: FormGroup;
  submitAttempt: boolean = false;

  incompRes = [];
  connectivityCheck: boolean;
  informationCheck: boolean = false;
  errorCheck: boolean = false;

  constructor(public navCtrl: NavController, public formBuilder: FormBuilder,public translate: TranslateService, public localstockage: LocalStockage, public incompatibilite: Incompatibilite, public formulaire: Formulaire, private network: Network) {
    this.resultatsForm = formBuilder.group({
      emailForm: ['', Validators.pattern('(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)')],
    });
    //Initialise les observateurs de la connexion et de la déconnexion
    this.network.onConnect().subscribe(() => {
      this.connectivityCheck = true;
    });
    this.network.onDisconnect().subscribe(() => {
      this.connectivityCheck = false;
    });
  }

  ngOnInit(){
    if (this.connectivityCheck == true){
      //Vérifier si certaines données du formulaire n'ont pas été envoyées
      this.localstockage.getData("idForm").then((val)=> {
        this.localstockage.getAllData().then((dataForm)=>{
          if (dataForm!=null){
            //Si certaines données n'ont pas été envoyées, il faut créer/mettre à jour le formulaire avec toutes les données stockées.
            if (val==null){
              //Si le formulaire n'a pas été créé, il faut le créer
              this.formulaire.createForm(dataForm).toPromise().then((res) => {
                this.localstockage.getData("idForm").then((val)=> {
                  this.incompatibilite.getIncomp(val).toPromise().then((res) => {
                    this.incompRes = [res.blob];//A VERIFIER - BLOB PERMET DE RETROUVER LE BODY DE LA REPONSE!!
                    this.informationCheck = true;
                  }).catch((err)=>{
                    console.error('ERROR', err);
                    this.errorCheck = true;
                  });
                });
              });
            } else {
              //Sinon, il faut le mettre à jour
              this.formulaire.updateForm(val,dataForm).toPromise().then((res) => {
                this.incompatibilite.getIncomp(val).toPromise().then((res) => {
                  this.incompRes = [res.blob];//A VERIFIER - BLOB PERMET DE RETROUVER LE BODY DE LA REPONSE!!
                  this.informationCheck = true;
                }).catch((err)=>{
                  console.error('ERROR', err);
                  this.errorCheck = true;
                });
              });
            }
          } else {
            this.incompatibilite.getIncomp(val).toPromise().then((res) => {
              this.incompRes = [res.blob];//A VERIFIER - BLOB PERMET DE RETROUVER LE BODY DE LA REPONSE!!
              this.informationCheck = true;
            }).catch((err)=>{
              console.error('ERROR', err);
              this.errorCheck = true;
            });
          }
        });
      });
    }
  }

  envoieEmail(){
    this.submitAttempt = true;
    if(this.resultatsForm.valid){
      //Stockage local des données remplies dans cette page de formulaire
      this.localstockage.setData(this.resultatsForm.value).then((message) => {
        console.log('Email : ' + message);
        //Mise à jour/création du formulaire sur le serveur avec les données entrées sur cette page du formulaire
        this.localstockage.getData("idForm").then((val)=> {
          this.localstockage.getAllData().then((dataForm)=>{
            //il faut créer/mettre à jour le formulaire avec toutes les données stockées
            if (val==null){
              //Si le formulaire n'a pas été créé, il faut le créer
              this.formulaire.createForm(dataForm);            
            } else {
              //Sinon, il faut le mettre à jour
              this.formulaire.updateForm(val,dataForm);
            }
          });
        });
      });
    }
  }

  /**
   * Fonction qui est liée au bouton "Terminé" sur la page de résultats du formulaire - Resultats.
   * Si toutes les données ont été envoyées sur le serveur, elle détruit l'idForm stocké localement.
   * Sinon, elle valide l'adresse email lorsque celle-ci a été saisie et la stocke localement.
   * Elle réorganise le stockage des données qui n'ont pas été envoyées sur le serveur.
   * Elle affiche ensuite la page d'accueil du formulaire - Accueil.
   * @method nextPage
   * @requires providers/localstockage - la fonction utilise les méthodes setData, getData, getAllData.
   * @requires providers/formulaire - la fonction utilise les méthodes createForm et updateForm.
   * @param {} - aucun paramètre n'est passé à la fonction.
   * @returns {} - aucune valeur n'est retournée par la fonction.
   */
  nextPage() {
    this.localstockage.getAllData().then((dataForm)=>{
      if (dataForm!=null){
        //stocker les variables sous une autre forme puis aller à la page d'accueil
      }      

      //Navigation à la page d'accueil du formulaire - Accueil
      this.navCtrl.popToRoot();
    });
  }
}