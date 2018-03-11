import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, AlertController } from 'ionic-angular';

import { TranslateService } from '@ngx-translate/core';
import { Keyboard } from '@ionic-native/keyboard';

import { TherapiesAlter } from '../therapies-alter/therapies-alter';
import{ Autocomplete } from '../../autocomplete/autocomplete';

import { Formulaire } from '../../../providers/formulaire';
import { LocalStockage } from '../../../providers/localstockage';
import { Traitement } from '../../../providers/traitement';
import { Cancer } from '../../../providers/cancer';
import { Diacritics } from '../../../providers/diacritics';
import { Inactif } from '../../../providers/inactif';

@Component({
  selector: 'maladie',
  templateUrl: 'maladie.html'
})
export class Maladie implements OnInit {

  maladieForm: FormGroup;
  anticancerForm: FormGroup;
  anticancerTable = [];
  choixTable = [];
  checkTraitement: boolean = false;
  nbTraitement: number = 0;
  submitAttempt: boolean = false;
  organeNom: any;
  organeElement: any;
  organeTitre: string;
  organePlaceholder: string;
  organeChoix: string;
  traitementNom: any;
  traitementElement: any;
  traitementTitre: string;
  traitementPlaceholder: string;
  
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public modalCtrl: ModalController, public translate: TranslateService, public formBuilder: FormBuilder, public formulaire: Formulaire, public localstockage: LocalStockage, public traitement: Traitement, public organe: Cancer, public keyboard: Keyboard, public diacritics: Diacritics, public inactif: Inactif) {
    this.maladieForm = formBuilder.group({
        organeForm: ['', Validators.compose([ Validators.pattern('([a-zA-Zéèêëàäâùüûïîöôçÿ ]*)([\-]?)([a-zA-Zéèêëàäâùüûïîöôçÿ ]*)'), Validators.required])],
        nom_organeForm: ['', Validators.compose([ Validators.pattern('([a-zA-Zéèêëàäâùüûïîöôçÿ ]*)([\-]?)([a-zA-Zéèêëàäâùüûïîöôçÿ ]*)'), Validators.required])],
        etatForm:  ['', Validators.required],
        radioForm:  ['', Validators.required],
        chirurgieForm:  ['', Validators.required]
    });
    this.anticancerForm = formBuilder.group({});
    this.organeNom = [];
    this.organeElement = [];
    this.traitementNom = [];
    this.traitementElement = [];
    /*Si l'utilisateur est inactif, une alerte est envoyée avec la possibilité de continuer ou de recommencer le questionnaire.
+   inactif.idleSet(navCtrl,alertCtrl);*/
  }

  ngOnInit(){
    this.createTraitObjet();
    this.createChoixObjet();
    this.anticancerForm.addControl(this.anticancerTable[0].traitementnom, this.anticancerTable[0].traitementnomControl);
    this.anticancerForm.addControl(this.anticancerTable[0].traitementid, this.anticancerTable[0].traitementidControl);
    this.traitement.makeTraitList(['TTCAN']).then((liste) =>{
      this.traitementNom = liste[0];
      this.traitementElement = liste[1];
    });
    this.organe.makeCancerList().then((liste) =>{
      this.organeNom = liste[0];
      this.organeElement = liste[1];
    });
    this.organeChoix = '';
  }

  /**
   * Fonction qui créé deux paires nom du traitement/identifiant du traitement et la stocke dans un tableau.
   * @method createTraitObjet
   * @param {} - aucun paramètre n'est passé à la fonction.
   * @returns {} - aucune valeur n'est retournée par la fonction.
   */
  createTraitObjet(){
    this.nbTraitement = this.nbTraitement+1;
    interface traitementObjet {
      traitementnom : string,
      traitementid : string,
      traitementnomControl : FormControl,
      traitementidControl : FormControl
    };
    var traitement: traitementObjet = {
      traitementnom: "traitementnom_"+this.nbTraitement.toString()+"_Form",
      traitementid: "traitementid_"+this.nbTraitement.toString()+"_Form",
      traitementnomControl : new FormControl ('', Validators.compose([ Validators.pattern('([0-9a-zA-Zéèêëàäâùüûïîöôçÿ \-\']*)'), Validators.required])),
      traitementidControl : new FormControl ('', Validators.compose([ Validators.pattern('([0-9]*)'), Validators.required]))
    }
    this.anticancerTable.push(traitement);
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
    var traitChoix: choixObjet = {
      choixTest : false,
      choixNom : ''
    }
    this.choixTable.push(traitChoix);
  }

  /**
   * Fonction qui permet d'ajouter un traitement.
   * @method addTrait
   * @param {} - aucun paramètre n'est passé à la fonction.
   * @returns {} - aucune valeur n'est retournée par la fonction.
   */
  addTrait() {
    if (this.anticancerForm.valid){
      let i: number = this.anticancerTable.length;
      this.createTraitObjet();
      this.createChoixObjet();
      // add treatment to the list
      this.anticancerForm.addControl(this.anticancerTable[i].traitementnom, this.anticancerTable[i].traitementnomControl);
      this.anticancerForm.addControl(this.anticancerTable[i].traitementid, this.anticancerTable[i].traitementidControl);
      this.checkTraitement = false;
      this.submitAttempt = false;
    } else {
      this.checkTraitement = true;
    }
  }

  /**
   * Fonction qui permet de supprimer un traitement.
   * @method removeTrait
   * @requires providers/localstockage - la fonction utilise la méthode removeData.
   * @param {number} - le numéro du traitement à supprimer est passé à la fonction.
   * @returns {} - aucune valeur n'est retournée par la fonction.
   */
  removeTrait(i: number) {
    // remove phyto treatment from the list
    var suppressionObjet = {}
    suppressionObjet[this.anticancerTable[i].traitementnom] = this.anticancerForm.value[this.anticancerTable[i].traitementnom];
    suppressionObjet[this.anticancerTable[i].traitementid] = this.anticancerForm.value[this.anticancerTable[i].traitementid];
    console.log(suppressionObjet);
    this.localstockage.removeData(suppressionObjet);
    this.anticancerForm.removeControl(this.anticancerTable[i].traitementnom);
    this.anticancerForm.removeControl(this.anticancerTable[i].traitementid);
    this.anticancerTable.splice(i,1);
    this.choixTable.splice(i,1);
  }

  /**
   * Fonction qui est liée au champ "Organe primitif atteint" sur la deuxième page du formulaire - Maladie.
   * Elle permet d'ouvrir une page modale (pages/autocomplete) qui propose, en fonction des entrées de l'utilisateur une liste de noms possibles : autocompletion.
   * @method showOrganeModal
   * @requires pages/autocomplete - elle appelle la page autocomplete.ts.
   * @param {} - aucun paramètre n'est passé à la fonction.
   * @returns {} - aucune valeur n'est retournée par la fonction.
   */
  showOrganeModal(){
    this.translate.get('TITRE_MODAL_ORGANE').subscribe(value => {
      this.organeTitre = value;
    });
    this.translate.get('PLACEHOLDER_MODAL_ORGANE').subscribe(value => {
      this.organePlaceholder = value;
    });
    let modal = this.modalCtrl.create(Autocomplete, {dataAutocomplete: this.organeNom, titreAutocomplete: this.organeTitre, placeholderAutocomplete: this.organePlaceholder});
    modal.onDidDismiss(data => {
      this.organeChoix = data;
      var organeData = this.organeElement.find((val)=>{
        let strVal = this.diacritics.replaceDiacritics(val.nom.toLowerCase());
        let strData = this.diacritics.replaceDiacritics(data.toLowerCase());
        if(strVal.indexOf(strData) > -1){
          return val;
        }
      });
      if(organeData){
        this.maladieForm.patchValue({organeForm: organeData.id});
        this.maladieForm.patchValue({nom_organeForm: organeData.nom});
      } else {
        this.maladieForm.patchValue({organeForm: 'AUCUN'});
        this.maladieForm.patchValue({nom_organeForm: this.organeChoix});
      }
    });
    modal.present();
  }

  /**
   * Fonction qui est liée au champ "Nom du traitement anti-cancéreux" sur la deuxième page du formulaire - Maladie.
   * Elle permet d'ouvrir une page modale (pages/autocomplete) qui propose, en fonction des entrées de l'utilisateur une liste de noms possibles : autocompletion.
   * @method showTraitementModal
   * @requires pages/autocomplete - elle appelle la page autocomplete.ts.
   * @param {} - aucun paramètre n'est passé à la fonction.
   * @returns {} - aucune valeur n'est retournée par la fonction.
   */
  showTraitementModal(i: number){
    this.translate.get('TITRE_MODAL_TRAITEMENT').subscribe(value => {
      this.traitementTitre = value;
    });
    this.translate.get('PLACEHOLDER_MODAL_TRAITEMENT').subscribe(value => {
      this.traitementPlaceholder = value;
    });
    let modal = this.modalCtrl.create(Autocomplete, {dataAutocomplete: this.traitementNom, titreAutocomplete: this.traitementTitre, placeholderAutocomplete: this.traitementPlaceholder});
    modal.onDidDismiss(data => {
      if (data && data.replace(/\s/g, '').length!=0){
        this.choixTable[i].choixTest = true;
        this.choixTable[i].choixNom = data;
        var traitementData = this.traitementElement.find((val)=>{
          let strVal = this.diacritics.replaceDiacritics(val.nom.toLowerCase());
          let strData = this.diacritics.replaceDiacritics(data.toLowerCase());
          if(strVal.indexOf(strData) > -1){
            return val;
          }
        });
        let dataObj =  {};      
        if(traitementData){
          dataObj[this.anticancerTable[i].traitementnom] = traitementData.nom;
          dataObj[this.anticancerTable[i].traitementid] = traitementData.id;
        } else {
          dataObj[this.anticancerTable[i].traitementnom] = data;
          dataObj[this.anticancerTable[i].traitementid] = 0;
        }
        this.anticancerForm.patchValue(dataObj);
      }
    });
    modal.present();
  }

  /**
   * Fonction qui est liée au bouton "Continuer" sur la deuxième page du formulaire - Maladie.
   * Elle valide les valeurs entrées dans les champs du formulaire et les stocke localement. 
   * Une fois ces valeurs stockées, elle récupère la valeur stockée correspondant à l'identificant du formulaire. 
   * Si aucun identifiant n'a été stocké, elle créé un nouveau formulaire avec toutes les données stockées. Sinon, elle met à jour le formulaire avec ces mêmes données.
   * Elle affiche ensuite la troisième page du formulaire - Traitements Alternatifs.
   * @method nextPage
   * @requires providers/localstockage - la fonction utilise les méthodes setData, getData, getAllData.
   * @requires providers/formulaire - la fonction utilise les méthodes createForm et updateForm.
   * @param {} - aucun paramètre n'est passé à la fonction.
   * @returns {} - aucune valeur n'est retournée par la fonction.
   */
  nextPage() {
    this.submitAttempt = true;
    if(this.maladieForm.valid && this.anticancerForm.valid){

      //Stockage local des données remplies dans cette page de formulaire
      this.localstockage.setData(this.maladieForm.value).then((message) => {
        console.log('Maladie : ' + message);
        this.localstockage.setData(this.anticancerForm.value).then((message) => {
          console.log('Anti Cancéreux : ' + message);
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
        });
        //Navigation à la page du formulaire - Traitements Alternatifs
        this.navCtrl.push(TherapiesAlter);
      });
    }
  }
}