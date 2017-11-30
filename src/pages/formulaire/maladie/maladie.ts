import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

import { TranslateService } from '@ngx-translate/core';

import { TherapiesAlter } from '../therapies-alter/therapies-alter';
import{ Autocomplete } from '../../autocomplete/autocomplete';

import { Formulaire } from '../../../providers/formulaire';
import { LocalStockage } from '../../../providers/localstockage';
import { Traitement } from '../../../providers/traitement';
import { Cancer } from '../../../providers/cancer';

@Component({
  selector: 'maladie',
  templateUrl: 'maladie.html'
})
export class Maladie implements OnInit {

  maladieForm: FormGroup;
  submitAttempt: boolean = false;
  organeNom: any;
  organeTitre: string;
  organePlaceholder: string;
  traitementNom: any;
  traitementTitre: string;
  traitementPlaceholder: string;
  
  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public translate: TranslateService, public formBuilder: FormBuilder, public formulaire: Formulaire, public localstockage: LocalStockage, public traitement: Traitement, public organe: Cancer) {
    this.maladieForm = formBuilder.group({
        organeForm: ['', Validators.compose([ Validators.pattern('([a-zA-Zéèêëàäâùüûïîöôçÿ ]*)([\-]?)([a-zA-Zéèêëàäâùüûïîöôçÿ ]*)'), Validators.required])],
        diagnosticForm: ['', Validators.required],
        etatForm:  ['', Validators.required],
        traitementForm: ['',Validators.compose([ Validators.pattern('([a-zA-Zéèêëàäâùüûïîöôçÿ ]*)([\-]*)'), Validators.required])],
        radioForm:  ['', Validators.required],
        date_naissanceForm: ['', Validators.required],
        oncoForm: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('([a-zA-Zéèêëàäâùüûïîöôçÿ. ]*)([\-]?)([a-zA-Zéèêëàäâùüûïîöôçÿ ]*)')])]
    });
    this.organeNom = [];
    this.traitementNom = [];
  }

  ngOnInit(){
    this.traitement.getTrait().toPromise().then((res) => {
      var auxTab = res.json().data;
      let traitementList = [];
      auxTab.forEach((element) => {
        traitementList.push(element.nom.charAt(0).toUpperCase() + element.nom.slice(1).toLowerCase());
      })
      this.traitementNom = traitementList;
      console.log(this.traitementNom)
    }).catch((err)=>{
      console.error('ERROR', err);
    });
    this.organe.getCancer().toPromise().then((res) => {
      var auxTab = res.json().data;
      let organeList = [];
      auxTab.forEach((element) => {
        organeList.push(element.nom.charAt(0).toUpperCase() + element.nom.slice(1).toLowerCase());
      })
      this.organeNom = organeList;
      console.log(this.organeNom)
    }).catch((err)=>{
      console.error('ERROR', err);
    });
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
    let modal = this.modalCtrl.create(Autocomplete, {dataAutocomplete: this.organeNom, titreAutocomplete: this.organeTitre, placeholderAutocomplete: this.organePlaceholder, enterAutocomplete: true});
    modal.onDidDismiss(data => {
      //console.log(data);
      this.maladieForm.patchValue({organeForm: data});
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
    //console.log(this.traitementNom);
    this.translate.get('TITRE_MODAL_TRAITEMENT').subscribe(value => {
      this.traitementTitre = value;
    });
    this.translate.get('PLACEHOLDER_MODAL_TRAITEMENT').subscribe(value => {
      this.traitementPlaceholder = value;
    });
    let modal = this.modalCtrl.create(Autocomplete, {dataAutocomplete: this.traitementNom, titreAutocomplete: this.traitementTitre, placeholderAutocomplete: this.traitementPlaceholder, enterAutocomplete: false});
    modal.onDidDismiss(data => {
      //console.log(data);
      this.maladieForm.patchValue({traitementForm: data});
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
              this.formulaire.updateForm(val,dataForm);
            }
          });
        });

        //Navigation à la troisième page du formulaire - Traitements Alternatifs
        this.navCtrl.push(TherapiesAlter);

      });
    }
  }
}