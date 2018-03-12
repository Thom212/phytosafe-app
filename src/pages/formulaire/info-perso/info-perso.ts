import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Component} from '@angular/core';
import { NavController, LoadingController} from 'ionic-angular';

import { TranslateService } from '@ngx-translate/core';

import { Accueil } from '../../accueil/accueil';

import { Formulaire } from '../../../providers/formulaire';
import { LocalStockage } from '../../../providers/localstockage';
import { TabacValidator } from '../../../providers/validators';

@Component({
  selector: 'info-perso',
  templateUrl: 'info-perso.html'
})
export class InfoPerso{

  infoPersoForm: FormGroup;
  submitAttempt: boolean = false;
  questionTabac: boolean = false;
  
  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, translate: TranslateService, public formBuilder: FormBuilder, public formulaire: Formulaire, public localstockage: LocalStockage) {
    this.infoPersoForm = formBuilder.group({
      date_naissanceForm: ['', Validators.required],
      tabacForm: ['',Validators.required],
      frequenceForm: ['']
    },{ validator: TabacValidator.isValid});
  }
  
  /**
   * Fonction qui permet le déploiement d'un menu proposant différentes fréquences, après que l'utilisateur ait dit fumer.
   * @method tabacOui
   * @param {} - aucun paramètre n'est passé à la fonction.
   * @returns {} - aucune valeur n'est retournée par la fonction.
   */
  tabacOui() {
    this.questionTabac = true;
  }

  /**
   * Fonction qui supprime le menu proposant différentes fréqences, après que l'utilisateur ait dit ne pas fumer.
   * @method tabacNon
   * @param {} - aucun paramètre n'est passé à la fonction.
   * @returns {} - aucune valeur n'est retournée par la fonction.
   */
  tabacNon() {
    this.questionTabac = false;
    this.infoPersoForm.controls.frequenceForm.setValue('');
  }

  
  /**
   * Fonction qui est liée au bouton "Continuer" sur la page du formulaire - Informations Générales.
   * Elle valide les valeurs entrées dans les champs du formulaire et les stocke localement. 
   * Une fois ces valeurs stockées, elle récupère la valeur stockée correspondant à l'identificant du formulaire. 
   * Si aucun identifiant n'a été stocké, elle créé un nouveau formulaire avec toutes les données stockées. Sinon, elle met à jour le formulaire avec ces mêmes données.
   * Elle affiche ensuite la page d'accueil du formulaire - Accueil.
   * @method nextPage
   * @requires providers/localstockage - la fonction utilise les méthodes setData, getData, getAllData.
   * @requires providers/formulaire - la fonction utilise les méthodes createForm et updateForm.
   * @param {} - aucun paramètre n'est passé à la fonction.
   * @returns {} - aucune valeur n'est retournée par la fonction.
   */
  nextPage() {
    this.submitAttempt = true;
    if(this.infoPersoForm.valid){
      let loader = this.loadingCtrl.create({
        content: "Enregistrement du formulaire. Veuillez patienter..."
      });
      loader.present();
      //Stockage local des données remplies dans cette page de formulaire
      this.localstockage.setData(this.infoPersoForm.value).then((message) => {
        console.log('Informations générales : ' + message);
        //Mise à jour/création du formulaire sur le serveur avec les données entrées sur cette page du formulaire
        this.localstockage.getData("idForm").then((val)=> {
          this.localstockage.getAllData().then((dataForm)=>{
            //il faut créer/mettre à jour le formulaire avec toutes les données stockées
            if (val==null){
              //Si le formulaire n'a pas été créé, il faut le créer
              this.formulaire.createForm(dataForm).toPromise().then((res) => {
                loader.dismiss();
                this.localstockage.clearStoreData("idForm");
                //Navigation à la page d'accueil du formulaire - Accueil
                this.navCtrl.push(Accueil);
              }).catch((err)=>{
                loader.dismiss();
                console.error('ERROR', err);
                this.localstockage.storeAllData(dataForm).then((res) => {
                  this.navCtrl.push(Accueil);
                }).catch((err)=>{
                  console.error('ERROR', err);
                  this.navCtrl.push(Accueil);
                });
              });
            } else {
              //Sinon, il faut le mettre à jour
              this.formulaire.updateForm(dataForm).toPromise().then((res) => {
                loader.dismiss();
                this.localstockage.clearStoreData("idForm");
                //Navigation à la page d'accueil du formulaire - Accueil
                this.navCtrl.push(Accueil);
              }).catch((err)=>{
                loader.dismiss();
                this.localstockage.clearStoreData("idForm");
                console.error('ERROR', err);
                this.localstockage.storeAllData(dataForm).then((res) => {
                  this.navCtrl.push(Accueil);
                }).catch((err)=>{
                  console.error('ERROR', err);
                  this.navCtrl.push(Accueil);
                });
              });
            }
          });
        });
      });
    }
  }
}