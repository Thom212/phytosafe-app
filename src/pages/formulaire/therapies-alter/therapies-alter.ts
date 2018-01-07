import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component} from '@angular/core';
import { NavController, LoadingController} from 'ionic-angular';
//NETWORK : import { Network } from '@ionic-native/network';

import { TranslateService } from '@ngx-translate/core';

import { TraitementNom } from '../traitement-nom/traitement-nom';
import { Resultats } from '../resultats/resultats';
import { ResultatsErreur } from '../resultats-erreur/resultats-erreur';

import { Formulaire } from '../../../providers/formulaire';
import { LocalStockage } from '../../../providers/localstockage';
import { TherapieValidator } from '../../../providers/validators';

@Component({
  selector: 'therapies-alter',
  templateUrl: 'therapies-alter.html'
})
export class TherapiesAlter{

  therapiesAlterForm: FormGroup;
  submitAttempt: boolean = false;

  questionsTherapie: boolean = false;
  checkAutres: boolean = false;
  
  //NETWORK : ajouter dans le constructeur private network: Network
  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, translate: TranslateService, public formBuilder: FormBuilder, public formulaire: Formulaire, public localstockage: LocalStockage) {
    this.therapiesAlterForm = formBuilder.group({
        therapiesForm: ['',Validators.required],
        phytoForm: [false],
        homeoForm: [false],
        aromaForm: [false],
        autres: [false],
        autresForm: ['']
    },{ validator: TherapieValidator.isValid}); 
  }

  /**
   * Fonction qui permet le déploiement d'un menu proposant différentes thérapies alternatives, après que l'utilisateur ait dit avoir recours à des thérapies alternatives.
   * @method therapieOui
   * @param {} - aucun paramètre n'est passé à la fonction.
   * @returns {} - aucune valeur n'est retournée par la fonction.
   */
  therapieOui() {
    this.questionsTherapie = true;
  }

  /**
   * Fonction qui supprime le menu proposant différentes thérapies alternatives, après que l'utilisateur ait dit ne pas avoir recours à des thérapies alternatives.
   * @method therapieNon
   * @param {} - aucun paramètre n'est passé à la fonction.
   * @returns {} - aucune valeur n'est retournée par la fonction.
   */
  therapieNon() {
    this.questionsTherapie = false;
    this.therapiesAlterForm.controls.phytoForm.setValue(false);
    this.therapiesAlterForm.controls.homeoForm.setValue(false);
    this.therapiesAlterForm.controls.aromaForm.setValue(false);
    this.therapiesAlterForm.controls.autres.setValue(false);
    this.therapiesAlterForm.controls.autresForm.setValue('');
  }

  /**
   * Fonction qui permet le déploiement d'un champ permettant d'entrer le nom d'une thérapie alternative, après que l'utilisateur ait dit avoir recours à des thérapies alternatives qui ne sont pas listées dans le formulaire.
   * @method autres
   * @param {} - aucun paramètre n'est passé à la fonction.
   * @returns {} - aucune valeur n'est retournée par la fonction.
   */
  autres(){
    if(this.checkAutres == false){
      this.checkAutres = true;
    }else{
      this.checkAutres = false;
      this.therapiesAlterForm.controls.autres.setValue(false);
      this.therapiesAlterForm.controls.autresForm.setValue('');
    }
  }

  /**
   * Fonction qui est liée au bouton "Continuer" sur la troisième page du formulaire - Thérapies Alternatives.
   * Elle valide les valeurs entrées dans les champs du formulaire et les stocke localement. 
   * Une fois ces valeurs stockées, elle récupère la valeur stockée correspondant à l'identificant du formulaire. 
   * Si aucun identifiant n'a été stocké, elle créé un nouveau formulaire avec toutes les données stockées. Sinon, elle met à jour le formulaire avec ces mêmes données.
   * Elle affiche ensuite la quatrième page du formulaire si l'utilisateur utilise au moins une thérapie alternative - Nom des Thérapies. Sinon, elle affiche ensuite la page des résultats - Résultats.
   * @method nextPage
   * @requires providers/localstockage - la fonction utilise les méthodes setData, getData, getAllData.
   * @requires providers/formulaire - la fonction utilise les méthodes createForm et updateForm.
   * @param {} - aucun paramètre n'est passé à la fonction.
   * @returns {} - aucune valeur n'est retournée par la fonction.
   */
  nextPage() {
    this.submitAttempt = true;
    if(this.therapiesAlterForm.valid){
      if (this.therapiesAlterForm.controls.phytoForm.value) {
        //Stockage local des données remplies dans cette page de formulaire
        this.localstockage.setData(this.therapiesAlterForm.value).then((message) => {
          console.log('Thérapies alternatives : ' + message);
          //Mise à jour/création du formulaire sur le serveur avec les données entrées sur cette page du formulaire
          this.localstockage.getData("idForm").then((val)=> {
            this.localstockage.getAllData().then((dataForm)=>{
              //il faut créer/mettre à jour le formulaire avec toutes les données stockées
              if (val==null){
                //Si le formulaire n'a pas été créé, il faut le créer
                this.formulaire.createForm(dataForm);  
              } else {
                //Sinon, il faut le mettre à jour
                this.formulaire.updateForm(dataForm)
              }
            });
          });
        });
        this.navCtrl.push(TraitementNom);
      } else {
        let loader = this.loadingCtrl.create({
          content: "Enregistrement du formulaire. Veuillez patienter..."
        });
        loader.present();
        //Stockage local des données remplies dans cette page de formulaire
        this.localstockage.setData(this.therapiesAlterForm.value).then((message) => {
          console.log('Thérapies alternatives : ' + message);
          //Mise à jour/création du formulaire sur le serveur avec les données entrées sur cette page du formulaire
          this.localstockage.getData("idForm").then((val)=> {
            this.localstockage.getAllData().then((dataForm)=>{
              //il faut créer/mettre à jour le formulaire avec toutes les données stockées
              if (val==null){
                //Si le formulaire n'a pas été créé, il faut le créer
                this.formulaire.createForm(dataForm).toPromise().then((res) => {
                  loader.dismiss();
                  //Navigation à la page des résultats du formulaire - Résultats
                  this.navCtrl.push(Resultats);
                }).catch((err)=>{
                  loader.dismiss();
                  this.navCtrl.push(ResultatsErreur,{
                    networkCheck : true, //ajouter la vérification de la connection : true si la connection est bonne, false si elle n'est pas bonne
                  });
                  console.error('ERROR', err);
                });            
              } else {
                //Sinon, il faut le mettre à jour
                this.formulaire.updateForm(dataForm).toPromise().then((res) => {
                  loader.dismiss();
                  //Navigation à la page des résultats du formulaire - Résultats
                  this.navCtrl.push(Resultats);
                }).catch((err)=>{
                  loader.dismiss();
                  this.navCtrl.push(ResultatsErreur,{
                    networkCheck : true //ajouter la vérification de la connection : true si la connection est bonne, false si elle n'est pas bonne
                  });
                  console.error('ERROR', err);
                });
              }
            });
          });
        });
      }
    }
  }
}