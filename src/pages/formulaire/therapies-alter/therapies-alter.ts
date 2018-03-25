import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { TranslateService } from '@ngx-translate/core';

import { TraitementNom } from '../traitement-nom/traitement-nom';
import { InfoPerso } from '../info-perso/info-perso';

import { Formulaire } from '../../../providers/formulaire';
import { LocalStockage } from '../../../providers/localstockage';
import { TherapieValidator } from '../../../providers/validators';
import { Inactif } from '../../../providers/inactif';

@Component({
  selector: 'therapies-alter',
  templateUrl: 'therapies-alter.html'
})
export class TherapiesAlter{

  therapiesAlterForm: FormGroup;
  submitAttempt: boolean = false;
  checkAutres: boolean = false;
  
  constructor(public navCtrl: NavController, translate: TranslateService, public formBuilder: FormBuilder, public formulaire: Formulaire, public localstockage: LocalStockage, public inactif: Inactif) {
    this.therapiesAlterForm = formBuilder.group({
        phytoForm: [false],
        boissonForm: [false],
        aromaForm: [false],
        vitamineForm: [false],
        homeoForm: [false],
        aucunForm: [false],
        inconnuForm: [false],
        autresboolForm: [false],
        autresForm: ['', Validators.pattern('([0-9a-zA-Zéèêëàäâùüûïîöôçÿ\u0153\\- \'\(\)]*)')]
    },{ validator: TherapieValidator.isValid}); 
  }

  ionViewDidEnter(){
    //Si l'utilisateur est inactif, une alerte est envoyée avec la possibilité de continuer ou de recommencer le questionnaire.
    this.inactif.idleSet(this.navCtrl);
  }

  ionViewWillLeave(){
    this.inactif.idleStop();
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
      this.therapiesAlterForm.controls.aucunForm.setValue(false);
      this.therapiesAlterForm.controls.inconnuForm.setValue(false);
    }else{
      this.checkAutres = false;
      this.therapiesAlterForm.controls.autresboolForm.setValue(false);
      this.therapiesAlterForm.controls.autresForm.setValue('');
    }
  }
  
  /**
   * Fonction qui supprime les entrées des différentes thérapies alternatives, après que l'utilisateur ait dit ne pas avoir recours à des thérapies alternatives.
   * @method aucun
   * @param {} - aucun paramètre n'est passé à la fonction.
   * @returns {} - aucune valeur n'est retournée par la fonction.
   */
  aucun() {
    this.checkAutres = false;
    this.therapiesAlterForm.controls.phytoForm.setValue(false);
    this.therapiesAlterForm.controls.boissonForm.setValue(false);
    this.therapiesAlterForm.controls.aromaForm.setValue(false);
    this.therapiesAlterForm.controls.vitamineForm.setValue(false);
    this.therapiesAlterForm.controls.homeoForm.setValue(false);
    this.therapiesAlterForm.controls.autresboolForm.setValue(false);
    this.therapiesAlterForm.controls.autresForm.setValue('');
    this.therapiesAlterForm.controls.inconnuForm.setValue(false);
  }

  /**
   * Fonction qui supprime les entrées des différentes thérapies alternatives, après que l'utilisateur ait dit ne pas savoir s'il a recours à des thérapies alternatives.
   * @method inconnu
   * @param {} - aucun paramètre n'est passé à la fonction.
   * @returns {} - aucune valeur n'est retournée par la fonction.
   */
  inconnu() {
    this.checkAutres = false;
    this.therapiesAlterForm.controls.phytoForm.setValue(false);
    this.therapiesAlterForm.controls.boissonForm.setValue(false);
    this.therapiesAlterForm.controls.aromaForm.setValue(false);
    this.therapiesAlterForm.controls.vitamineForm.setValue(false);
    this.therapiesAlterForm.controls.homeoForm.setValue(false);
    this.therapiesAlterForm.controls.autresboolForm.setValue(false);
    this.therapiesAlterForm.controls.autresForm.setValue('');
    this.therapiesAlterForm.controls.aucunForm.setValue(false);
  }

  /**
   * Fonction qui supprime l'entrée de "aucune", après que l'utilisateur ait dit avoir recours à des thérapies alternatives.
   * @method therapie
   * @param {} - aucun paramètre n'est passé à la fonction.
   * @returns {} - aucune valeur n'est retournée par la fonction.
   */
  therapie() {
    this.therapiesAlterForm.controls.aucunForm.setValue(false);
    this.therapiesAlterForm.controls.inconnuForm.setValue(false);
  }

  /**
   * Fonction qui est liée au bouton "Continuer" sur page du formulaire - Thérapies Alternatives.
   * Elle valide les valeurs entrées dans les champs du formulaire et les stocke localement. 
   * Une fois ces valeurs stockées, elle récupère la valeur stockée correspondant à l'identificant du formulaire. 
   * Si aucun identifiant n'a été stocké, elle créé un nouveau formulaire avec toutes les données stockées. Sinon, elle met à jour le formulaire avec ces mêmes données.
   * Elle affiche ensuite la page du formulaire relative aux noms des thérapies si l'utilisateur utilise au moins une thérapie alternative - Nom des Thérapies. Sinon, elle affiche ensuite la page relative aux informations générales - Informations Générales.
   * @method nextPage
   * @requires providers/localstockage - la fonction utilise les méthodes setData, getData, getAllData.
   * @requires providers/formulaire - la fonction utilise les méthodes createForm et updateForm.
   * @param {} - aucun paramètre n'est passé à la fonction.
   * @returns {} - aucune valeur n'est retournée par la fonction.
   */
  nextPage() {
    this.submitAttempt = true;
    if(this.therapiesAlterForm.valid){
      //Stockage local des données remplies dans cette page de formulaire
      this.localstockage.setData(this.therapiesAlterForm.value).then((message) => {
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
        if (this.therapiesAlterForm.controls.phytoForm.value || this.therapiesAlterForm.controls.vitamineForm.value || this.therapiesAlterForm.controls.boissonForm.value) {
          this.navCtrl.push(TraitementNom);
        } else {
          this.navCtrl.push(InfoPerso);
        }
      });
    }
  }
}