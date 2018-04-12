import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, ViewChild, NgZone } from '@angular/core';
import { NavController, LoadingController, Content } from 'ionic-angular';

import { TranslateService } from '@ngx-translate/core';

import { FinFormulaire } from '../fin-formulaire/fin-formulaire';

import { Formulaire } from '../../../providers/formulaire';
import { LocalStockage } from '../../../providers/localstockage';
import { TabacValidator } from '../../../providers/validators';
import { Inactif } from '../../../providers/inactif';

@Component({
  selector: 'info-perso',
  templateUrl: 'info-perso.html'
})
export class InfoPerso{

  @ViewChild(Content) content: Content;

  infoPersoForm: FormGroup;
  submitAttempt: boolean = false;
  questionTabac: boolean = false;
  dateNaissance: boolean = false;
  contentLoader: string;
  showScrollFabInfoPerso: boolean = false;
  contentDimensions: any;
  
  constructor(public navCtrl: NavController, public zone: NgZone, public loadingCtrl: LoadingController, public translate: TranslateService, public formBuilder: FormBuilder, public formulaire: Formulaire, public localstockage: LocalStockage, public inactif: Inactif) {
    this.infoPersoForm = formBuilder.group({
      sexeForm: ['', Validators.required],
      date_naissanceForm: ['', Validators.compose([ Validators.pattern('([0-9]{1,3})'), Validators.required])],
      tabacForm: ['',Validators.required],
      frequenceForm: [''],
      cannabisForm: ['',Validators.required]
    },{ validator: TabacValidator.isValid});
    this.contentDimensions = {};
  }

  ionViewDidEnter(){
    //Si l'utilisateur est inactif, une alerte est envoyée avec la possibilité de continuer ou de recommencer le questionnaire.
    this.inactif.idleSet(this.navCtrl);
    this.translate.get('CONTENT_LOADER').subscribe(value => {
      this.contentLoader = value;
    });
    this.contentDimensions = this.content.getContentDimensions();
    if (this.contentDimensions.contentHeight + 50 < this.contentDimensions.scrollHeight) {
      this.showScrollFabInfoPerso = true;
    }
  }

  ionViewWillLeave(){
    this.inactif.idleStop();
  }

  /**
   * Fonction qui permet d'afficher ou de cahcer le boutton fab.
   * @method displayFab
   * @param {} - aucun paramètre n'est passé à la fonction.
   * @returns {} - aucune valeur n'est retournée par la fonction.
   */
  displayFab(){
    this.zone.run(() => {
      this.contentDimensions = this.content.getContentDimensions();
      if (this.contentDimensions.contentHeight + 50 + this.contentDimensions.scrollTop < this.contentDimensions.scrollHeight) {
        this.showScrollFabInfoPerso = true;
      } else {
        this.showScrollFabInfoPerso = false;
      }
    });
  }

  /**
   * Fonction qui permet de scroller tout en bas du contenu.
   * @method scrollDownContent
   * @param {} - aucun paramètre n'est passé à la fonction.
   * @returns {} - aucune valeur n'est retournée par la fonction.
   */
  scrollDownContent() {
    this.content.scrollToBottom();
  }

  /**
   * Fonction qui permet de modifier la classe CSS de l'étiquette.
   * @method labelBlur
   * @param {} - aucun paramètre n'est passé à la fonction.
   * @returns {} - aucune valeur n'est retournée par la fonction.
   */
  labelBlur() {
    if (this.infoPersoForm.value['date_naissanceForm'] === '') {
      this.dateNaissance = false;
    }
  }

  /**
   * Fonction qui permet de modifier la classe CSS de l'étiquette.
   * @method labelFocus
   * @param {} - aucun paramètre n'est passé à la fonction.
   * @returns {} - aucune valeur n'est retournée par la fonction.
   */
  labelFocus() {
    this.dateNaissance = true;
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
   * Elle affiche ensuite la page de fin du formulaire - FinFormulaire.
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
        content: ''
      });
      loader.setContent(this.contentLoader);
      loader.present();
      //Stockage local des données remplies dans cette page de formulaire
      this.localstockage.setData(this.infoPersoForm.value).then((message) => {
        //Mise à jour/création du formulaire sur le serveur avec les données entrées sur cette page du formulaire
        this.localstockage.getData("idForm").then((val)=> {
          this.localstockage.getAllData().then((dataForm)=>{
            //il faut créer/mettre à jour le formulaire avec toutes les données stockées
            if (val==null){
              //Si le formulaire n'a pas été créé, il faut le créer
              this.formulaire.createForm(dataForm).toPromise().then((res) => {
                loader.dismiss();
                this.localstockage.clearStoreData("idForm");
                //Navigation à la page de fin du formulaire - FinFormulaire
                this.navCtrl.push(FinFormulaire, {
                  succesForm : true
                });
              }).catch((err)=>{
                console.error('ERROR', err);
                this.localstockage.storeAllData(dataForm).then((res) => {
                  loader.dismiss();
                  this.navCtrl.push(FinFormulaire, {
                    succesForm : true
                  });
                }).catch((err)=>{
                  console.error('ERROR', err);
                  loader.dismiss();
                  this.navCtrl.push(FinFormulaire, {
                    succesForm : false
                  });
                });
              });
            } else {
              //Sinon, il faut le mettre à jour
              this.formulaire.updateForm(dataForm).toPromise().then((res) => {
                loader.dismiss();
                this.localstockage.clearStoreData("idForm");
                //Navigation à la page de fin du formulaire - FinFormulaire
                this.navCtrl.push(FinFormulaire, {
                  succesForm : true
                });
              }).catch((err)=>{
                this.localstockage.clearStoreData("idForm");
                console.error('ERROR', err);
                this.localstockage.storeAllData(dataForm).then((res) => {
                  loader.dismiss();
                  this.navCtrl.push(FinFormulaire, {
                    succesForm : true
                  });
                }).catch((err)=>{
                  console.error('ERROR', err);
                  loader.dismiss();
                  this.navCtrl.push(FinFormulaire, {
                    succesForm : false
                  });
                });
              });
            }
          });
        });
      });
    }
  }
}