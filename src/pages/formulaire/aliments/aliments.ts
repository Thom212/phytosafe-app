import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, ViewChild, NgZone } from '@angular/core';
import { NavController, Content } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Keyboard } from '@ionic-native/keyboard';

//Page suivante
import { InfoPerso } from '../info-perso/info-perso';

//Providers
import { Formulaire } from '../../../providers/formulaire';
import { LocalStockage } from '../../../providers/localstockage';
import { Diacritics } from '../../../providers/diacritics';
import { Inactif } from '../../../providers/inactif';

@Component({
  selector: 'aliments',
  templateUrl: 'aliments.html'
})
export class Aliments {

  @ViewChild(Content) content: Content;

  alimentationForm: FormGroup;
  fruitFrom: FormGroup;
  submitAttempt: boolean = false;
  showScrollFabTherapies: boolean = false;
  contentDimensions: any;
  
  constructor(public navCtrl: NavController, public zone: NgZone, public translate: TranslateService, public formBuilder: FormBuilder, public formulaire: Formulaire, public localstockage: LocalStockage, public keyboard: Keyboard, public diacritics: Diacritics, public inactif: Inactif) {
    this.alimentationForm = formBuilder.group({
        cafeForm: [false],
        theForm: [false],
        reglisseForm: [false],
        sojaForm: [false],
        pamplemousseForm: [false],
        pomeloForm: [false],
        orangeForm: [false],
        cranberryForm: [false]
    });

    this.contentDimensions = {};
  }

  ionViewDidEnter(){
    //Si l'utilisateur est inactif, une alerte est envoyée avec la possibilité de continuer ou de recommencer le questionnaire.
    this.inactif.idleSet(this.navCtrl);
    this.contentDimensions = this.content.getContentDimensions();
    if (this.contentDimensions.contentHeight + 50 < this.contentDimensions.scrollHeight) {
      this.showScrollFabTherapies = true;
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
   * Fonction qui est liée au bouton "Continuer" sur la page du formulaire - Aliments.
   * Elle valide les valeurs entrées dans les champs du formulaire et les stocke localement. 
   * Une fois ces valeurs stockées, elle récupère la valeur stockée correspondant à l'identificant du formulaire. 
   * Si aucun identifiant n'a été stocké, elle créé un nouveau formulaire avec toutes les données stockées. Sinon, elle met à jour le formulaire avec ces mêmes données.
   * Elle affiche ensuite la dernière page du formulaire - Informations Personnelles.
   * @method nextPage
   * @requires providers/localstockage - la fonction utilise les méthodes setData, getData, getAllData.
   * @requires providers/formulaire - la fonction utilise les méthodes createForm et updateForm.
   * @param {} - aucun paramètre n'est passé à la fonction.
   * @returns {} - aucune valeur n'est retournée par la fonction.
   */
  nextPage() {
    this.submitAttempt = true;
    if(this.alimentationForm.valid){

      //Stockage local des données remplies dans cette page de formulaire
      this.localstockage.setData(this.alimentationForm.value).then((message) => {
        //Mise à jour/création du formulaire sur le serveur avec les données entrées sur cette page du formulaire
        this.localstockage.getData("idForm").then((val)=> {
          this.localstockage.getAllData().then((dataForm)=>{
            //il faut créer/mettre à jour le formulaire avec toutes les données stockées
            if (val==null){
              //Si le formulaire n'a pas été créé, il faut le créer
              this.formulaire.createForm(dataForm);
            } else {
              //Sinon, il faut le mettre à jour
              this.formulaire.updateForm(dataForm);
            }
          });
          //Navigation à la page du formulaire - Traitements Alternatifs
          this.navCtrl.push(InfoPerso);
        });
      });
    }
  }
}