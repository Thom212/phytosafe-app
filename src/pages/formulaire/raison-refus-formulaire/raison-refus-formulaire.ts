import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, ViewChild, NgZone } from '@angular/core';
import { NavController, ModalController, LoadingController, Content } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

//page suivante
import { RefusFormulaire } from '../../formulaire/refus-formulaire/refus-formulaire';

//Providers
import { Formulaire } from '../../../providers/formulaire';
import { LocalStockage } from '../../../providers/localstockage';
import { Inactif } from '../../../providers/inactif';


@Component({
  selector: 'raison-refus-formulaire',
  templateUrl: 'raison-refus-formulaire.html'
})

export class RaisonRefusFormulaire {

  @ViewChild(Content) content: Content;

  refusForm: FormGroup;
  submitAttempt: boolean = false;
  showScrollFabTherapies: boolean = false;
  contentLoader: string;
  showScrollFabInfoPerso: boolean = false;
  contentDimensions: any;
  
  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public zone: NgZone, public loadingCtrl: LoadingController, public localstockage: LocalStockage, public formulaire: Formulaire, public translate: TranslateService, public formBuilder: FormBuilder, public inactif: Inactif) {
    this.refusForm = formBuilder.group({
      raisonRefusForm:  ['', Validators.required]
    });
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
   * Fonction qui permet d'afficher ou de cacher le boutton fab.
   * @method displayFab
   * @param {} - aucun paramètre n'est passé à la fonction.
   * @returns {} - aucune valeur n'est retournée par la fonction.
   */
  displayFab(){
    this.zone.run(() => {
      this.contentDimensions = this.content.getContentDimensions();
      if (this.contentDimensions.contentHeight + 50 + this.contentDimensions.scrollTop < this.contentDimensions.scrollHeight) {
        this.showScrollFabTherapies = true;
      } else {
        this.showScrollFabTherapies = false;
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
    if(this.refusForm.valid){
      let loader = this.loadingCtrl.create({
        content: ''
      });
      loader.setContent(this.contentLoader);
      loader.present();
      //Stockage local des données remplies dans cette page de formulaire
      this.localstockage.setData(this.refusForm.value).then((message) => {
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
                this.navCtrl.push(RefusFormulaire);
              }).catch((err)=>{
                console.error('ERROR', err);
                this.localstockage.storeAllData(dataForm).then((res) => {
                  loader.dismiss();
                  this.navCtrl.push(RefusFormulaire);
                }).catch((err)=>{
                  console.error('ERROR', err);
                  loader.dismiss();
                  this.navCtrl.push(RefusFormulaire);
                });
              });
            } else {
              //Sinon, il faut le mettre à jour
              this.formulaire.updateForm(dataForm).toPromise().then((res) => {
                loader.dismiss();
                this.localstockage.clearStoreData("idForm");
                //Navigation à la page de fin du formulaire - FinFormulaire
                this.navCtrl.push(RefusFormulaire);
              }).catch((err)=>{
                this.localstockage.clearStoreData("idForm");
                console.error('ERROR', err);
                this.localstockage.storeAllData(dataForm).then((res) => {
                  loader.dismiss();
                  this.navCtrl.push(RefusFormulaire);
                }).catch((err)=>{
                  console.error('ERROR', err);
                  loader.dismiss();
                  this.navCtrl.push(RefusFormulaire);
                });
              });
            }
          });
        });
      });
    }
  }
}