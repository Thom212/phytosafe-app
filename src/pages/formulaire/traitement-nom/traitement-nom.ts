import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { NavController, ModalController, NavParams, Content } from 'ionic-angular';

import { TranslateService } from '@ngx-translate/core';

import { InfoPerso } from '../info-perso/info-perso';
import{ Autocomplete } from '../../autocomplete/autocomplete';

import { Formulaire } from '../../../providers/formulaire';
import { LocalStockage } from '../../../providers/localstockage';
import { Traitement } from '../../../providers/traitement';
import { Diacritics } from '../../../providers/diacritics';
import { Inactif } from '../../../providers/inactif';

@Component({
  selector: 'traitement-nom',
  templateUrl: 'traitement-nom.html'
})
export class TraitementNom implements OnInit{

  @ViewChild(Content) content: Content;

  traitementNomForm: FormGroup;
  submitAttempt: boolean = false;
  checkTraitement: boolean = false;
  nbTraitement: number = 0;
  traitementTable = [];

  traitementNom: any;
  traitementElement: any;
  traitementTitre: string;
  traitementPlaceholder: string;
  liste = [];
  traitementChoix = [];
  showScrollFabTraitement: boolean = false;
  contentDimensions: any;
  
  constructor(public navCtrl: NavController, public zone: NgZone, public navParams: NavParams, public modalCtrl: ModalController, public translate: TranslateService, public formBuilder: FormBuilder, public formulaire: Formulaire, public localstockage: LocalStockage, public traitement: Traitement, public diacritics: Diacritics, public inactif: Inactif) {
    this.traitementNomForm = formBuilder.group({});
    this.traitementNom = [];
    this.traitementElement = [];
    this.liste = this.navParams.get('liste');
    this.contentDimensions = {};
  }

  ngOnInit(){
    this.createTraitObjet();
    this.createChoixObjet();
    this.traitementNomForm.addControl(this.traitementTable[0].phytonom, this.traitementTable[0].phytonomControl);
    this.traitementNomForm.addControl(this.traitementTable[0].phytoid, this.traitementTable[0].phytoidControl);
    this.traitementNom = this.liste[0];
    this.traitementElement = this.liste[1];
  }

  ionViewDidEnter(){
    //Si l'utilisateur est inactif, une alerte est envoyée avec la possibilité de continuer ou de recommencer le questionnaire.
    this.inactif.idleSet(this.navCtrl);
    this.contentDimensions = this.content.getContentDimensions();
    if (this.contentDimensions.contentHeight + 50 < this.contentDimensions.scrollHeight) {
      this.showScrollFabTraitement = true;
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
        this.showScrollFabTraitement = true;
      } else {
        this.showScrollFabTraitement = false;
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
   * Fonction qui créé trois paires nom du traitement/date de début du traitement/identifiant du traitement et la stocke dans un tableau.
   * @method createTraitObjet
   * @param {} - aucun paramètre n'est passé à la fonction.
   * @returns {} - aucune valeur n'est retournée par la fonction.
   */
  createTraitObjet(){
    this.nbTraitement = this.nbTraitement+1;
    interface traitementObjet {
      phytonom : string,
      phytoid : string,
      phytonomControl : FormControl,
      phytoidControl : FormControl
    };
    var phytoForm: traitementObjet;
    if (this.nbTraitement == 1) {
      phytoForm = {
        phytonom: "phytonom_"+this.nbTraitement.toString()+"_Form",
        phytoid: "phytoid_"+this.nbTraitement.toString()+"_Form",
        phytonomControl : new FormControl ('', Validators.pattern('([0-9a-zA-Zéèêëàäâùüûïîöôçÿ\u0153\\- \'\(\)]*)')),
        phytoidControl : new FormControl ('', Validators.pattern('([0-9]*)'))
      }
    } else {
      phytoForm = {
        phytonom: "phytonom_"+this.nbTraitement.toString()+"_Form",
        phytoid: "phytoid_"+this.nbTraitement.toString()+"_Form",
        phytonomControl : new FormControl ('', Validators.compose([ Validators.pattern('([0-9a-zA-Zéèêëàäâùüûïîöôçÿ\u0153\\- \'\(\)]*)'), Validators.required])),
        phytoidControl : new FormControl ('', Validators.compose([ Validators.pattern('([0-9]*)'), Validators.required]))
      }
    }
    this.traitementTable.push(phytoForm);
  }

  /**
   * Fonction qui créé deux paires traitement choisi/nom du traitement et la stocke dans un tableau.
   * @method createChoixObjet
   * @param {} - aucun paramètre n'est passé à la fonction.
   * @returns {} - aucune valeur n'est retournée par la fonction.
   */
  createChoixObjet(){
    interface choixObjet {
      choixTest : boolean,
      choixNom : string
    };
    var phytoChoix: choixObjet = {
      choixTest : false,
      choixNom : ''
    }
    this.traitementChoix.push(phytoChoix);
  }

  /**
   * Fonction qui permet d'ajouter un traitement.
   * @method addPhyto
   * @param {} - aucun paramètre n'est passé à la fonction.
   * @returns {} - aucune valeur n'est retournée par la fonction.
   */
  addPhyto() {
    if (this.traitementNomForm.valid){
      let i: number = this.traitementTable.length;
      this.createTraitObjet();
      this.createChoixObjet();
      // add phyto treatment to the list
      this.traitementNomForm.addControl(this.traitementTable[i].phytonom, this.traitementTable[i].phytonomControl);
      this.traitementNomForm.addControl(this.traitementTable[i].phytoid, this.traitementTable[i].phytoidControl);
      this.checkTraitement = false;
      this.submitAttempt = false;
      this.showTraitementModal(i);
    }else{
      this.checkTraitement = true;
    }
  }

  /**
   * Fonction qui permet de supprimer un traitement.
   * @method removePhyto
   * @requires providers/localstockage - la fonction utilise la méthode removeData.
   * @param {number} - le numéro du traitement à supprimer est passé à la fonction.
   * @returns {} - aucune valeur n'est retournée par la fonction.
   */
  removePhyto(i: number) {
    // remove phyto treatment from the list
    var suppressionObjet = {}
    suppressionObjet[this.traitementTable[i].phytonom] = this.traitementNomForm.value[this.traitementTable[i].phytonom];
    suppressionObjet[this.traitementTable[i].phytoid] = this.traitementNomForm.value[this.traitementTable[i].phytoid];
    this.localstockage.removeData(suppressionObjet);
    this.traitementNomForm.removeControl(this.traitementTable[i].phytonom);
    this.traitementNomForm.removeControl(this.traitementTable[i].phytoid);
    this.traitementTable.splice(i,1);
    this.traitementChoix.splice(i,1);
  }

  /**
   * Fonction qui est liée au champ "Nom du traitement" sur la page du formulaire - Nom des Thérapies.
   * Elle permet d'ouvrir une page modale (pages/autocomplete) qui propose, en fonction des entrées de l'utilisateur une liste de noms possibles : autocompletion.
   * @method showTraitementModal
   * @requires pages/autocomplete - elle appelle la page autocomplete.ts.
   * @param {} - aucun paramètre n'est passé à la fonction.
   * @returns {} - aucune valeur n'est retournée par la fonction.
   */
  showTraitementModal(i: number){
    this.translate.get('TITRE_MODAL_TRAITEMENT_BIS').subscribe(value => {
      this.traitementTitre = value;
    });
    this.translate.get('PLACEHOLDER_MODAL_TRAITEMENT').subscribe(value => {
      this.traitementPlaceholder = value;
    });
    let modal = this.modalCtrl.create(Autocomplete, {entryAutocomplete: this.traitementTable[i].phytonomControl.value, dataAutocomplete: this.traitementNom, titreAutocomplete: this.traitementTitre, placeholderAutocomplete: this.traitementPlaceholder});
    modal.onDidDismiss(data => {
      if (data && data.replace(/\s/g, '').length!=0){
        this.traitementChoix[i].choixTest = true;
        this.traitementChoix[i].choixNom = data;
        var traitementData = this.traitementElement.find((val)=>{
          let strVal = this.diacritics.replaceDiacritics(val.nom.toLowerCase());
          let strData = this.diacritics.replaceDiacritics(data.toLowerCase());
          if(strVal === strData){
            return val;
          }
        });
        let dataObj =  {};
        if(traitementData){
          dataObj[this.traitementTable[i].phytonom] = traitementData.nom;
          dataObj[this.traitementTable[i].phytoid] = traitementData.id;
        } else {
          dataObj[this.traitementTable[i].phytonom] = data;
          dataObj[this.traitementTable[i].phytoid] = 0;
        }
        this.traitementNomForm.patchValue(dataObj);
      }
    });
    modal.present();
  }

  /**
   * Fonction qui est liée au bouton "Continuer" sur la page du formulaire - Nom des Thérapies.
   * Elle valide les valeurs entrées dans les champs du formulaire et les stocke localement. 
   * Une fois ces valeurs stockées, elle récupère la valeur stockée correspondant à l'identificant du formulaire. 
   * Si aucun identifiant n'a été stocké, elle créé un nouveau formulaire avec toutes les données stockées. Sinon, elle met à jour le formulaire avec ces mêmes données.
   * Elle affiche ensuite la page des informations générales du formulaire - Informations Générales.
   * @method nextPage
   * @requires providers/localstockage - la fonction utilise les méthodes setData, getData, getAllData.
   * @requires providers/formulaire - la fonction utilise les méthodes createForm et updateForm.
   * @param {} - aucun paramètre n'est passé à la fonction.
   * @returns {} - aucune valeur n'est retournée par la fonction.
   */
  nextPage() {
    this.submitAttempt = true;
    if(this.traitementNomForm.valid){
      //Stockage local des données remplies dans cette page de formulaire
      this.localstockage.setData(this.traitementNomForm.value).then((message) => {
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
        });    
        //Navigation à la page du formulaire - Informations Générales
        this.navCtrl.push(InfoPerso);
      });
    }
  }
}