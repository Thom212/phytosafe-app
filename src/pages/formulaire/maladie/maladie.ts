import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

import { TranslateService } from '@ngx-translate/core';
import { Keyboard } from '@ionic-native/keyboard';

import { TherapiesAlter } from '../therapies-alter/therapies-alter';
import{ Autocomplete } from '../../autocomplete/autocomplete';

import { Formulaire } from '../../../providers/formulaire';
import { LocalStockage } from '../../../providers/localstockage';
import { Traitement } from '../../../providers/traitement';
import { Cancer } from '../../../providers/cancer';
import { Diacritics } from '../../../providers/diacritics';

@Component({
  selector: 'maladie',
  templateUrl: 'maladie.html'
})
export class Maladie implements OnInit {

  maladieForm: FormGroup;
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
  traitementChoix: string;
  
  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public translate: TranslateService, public formBuilder: FormBuilder, public formulaire: Formulaire, public localstockage: LocalStockage, public traitement: Traitement, public organe: Cancer, public keyboard: Keyboard, public diacritics: Diacritics) {
    this.maladieForm = formBuilder.group({
        organeForm: ['', Validators.compose([ Validators.pattern('([a-zA-Zéèêëàäâùüûïîöôçÿ ]*)([\-]?)([a-zA-Zéèêëàäâùüûïîöôçÿ ]*)'), Validators.required])],
        nom_organeForm: ['', Validators.compose([ Validators.pattern('([a-zA-Zéèêëàäâùüûïîöôçÿ ]*)([\-]?)([a-zA-Zéèêëàäâùüûïîöôçÿ ]*)'), Validators.required])],
        diagnosticForm: ['', Validators.required],
        etatForm:  ['', Validators.required],
        traitementForm: ['',Validators.compose([ Validators.pattern('([0-9]*)'), Validators.required])],
        date_traitementForm: ['', Validators.required],
        nom_traitementForm: ['',Validators.compose([ Validators.pattern('([a-zA-Zéèêëàäâùüûïîöôçÿ ]*)([\-]?)([a-zA-Zéèêëàäâùüûïîöôçÿ ]*)'), Validators.required])],
        radioForm:  ['', Validators.required],
        date_naissanceForm: ['', Validators.required],
        oncoForm: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('([a-zA-Zéèêëàäâùüûïîöôçÿ. ]*)([\-]?)([a-zA-Zéèêëàäâùüûïîöôçÿ ]*)')])]
    });
    this.organeNom = [];
    this.organeElement = [];
    this.traitementNom = [];
    this.traitementElement = [];
  }

  ngOnInit(){
    this.traitement.makeTraitList(['CANPO','CANIV']).then((liste) =>{
      this.traitementNom = liste[0];
      this.traitementElement = liste[1];
    });
    this.organe.makeCancerList().then((liste) =>{
      this.organeNom = liste[0];
      this.organeElement = liste[1];
    });
    this.organeChoix = '';
    this.traitementChoix = '';
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
  showTraitementModal(){
    this.translate.get('TITRE_MODAL_TRAITEMENT').subscribe(value => {
      this.traitementTitre = value;
    });
    this.translate.get('PLACEHOLDER_MODAL_TRAITEMENT').subscribe(value => {
      this.traitementPlaceholder = value;
    });
    let modal = this.modalCtrl.create(Autocomplete, {dataAutocomplete: this.traitementNom, titreAutocomplete: this.traitementTitre, placeholderAutocomplete: this.traitementPlaceholder});
    modal.onDidDismiss(data => {
      this.traitementChoix = data;
      var traitementData = this.traitementElement.find((val)=>{
        let strVal = this.diacritics.replaceDiacritics(val.nom.toLowerCase());
        let strData = this.diacritics.replaceDiacritics(data.toLowerCase());
        if(strVal.indexOf(strData) > -1){
          return val;
        }
      });
      if(traitementData){
        this.maladieForm.patchValue({traitementForm: traitementData.id});
        this.maladieForm.patchValue({nom_traitementForm: traitementData.nom});
      } else {
        this.maladieForm.patchValue({traitementForm: 0});
        this.maladieForm.patchValue({nom_traitementForm: this.traitementChoix});
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
    if(this.maladieForm.valid){

      //Stockage local des données remplies dans cette page de formulaire
      this.localstockage.setData(this.maladieForm.value).then((message) => {
        console.log('Maladie : ' + message);

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

        //Navigation à la troisième page du formulaire - Traitements Alternatifs
        this.navCtrl.push(TherapiesAlter);

      });
    }
  }
}