import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { NavController, ModalController, Content } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Keyboard } from '@ionic-native/keyboard';

//page suivante
import { Therapies } from '../therapies/therapies';
//page autocomplete
import{ Autocomplete } from '../../autocomplete/autocomplete';

//providers
import { Formulaire } from '../../../providers/formulaire';
import { LocalStockage } from '../../../providers/localstockage';
import { Cancer } from '../../../providers/cancer';
import { Diacritics } from '../../../providers/diacritics';
import { Inactif } from '../../../providers/inactif';
import { MaladieValidator } from '../../../providers/validators';

@Component({
  selector: 'maladie',
  templateUrl: 'maladie.html'
})
export class Maladie implements OnInit {

  @ViewChild(Content) content: Content;

  maladieForm: FormGroup;
  submitAttempt: boolean = false;
  organeNom: any;
  organeElement: any;
  organeTitre: string;
  organePlaceholder: string;
  organeChoix: string;
  questionOrgane: boolean = false;
  showScrollFabMaladie: boolean = false;
  contentDimensions: any;
  
  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public zone: NgZone, public translate: TranslateService, public formBuilder: FormBuilder, public formulaire: Formulaire, public localstockage: LocalStockage, public organe: Cancer, public keyboard: Keyboard, public diacritics: Diacritics, public inactif: Inactif) {
    this.maladieForm = formBuilder.group({
      organeboolForm : ['', Validators.required],
      organeForm: ['', Validators.pattern('([A-Z ]{5})')],
      nom_organeForm: ['', Validators.pattern('([0-9a-zA-Zéèêëàäâùüûïîöôçÿ\u0152\u0153\\- \'\(\)]*)')],
      etatForm:  ['', Validators.required]
    },{ validator: MaladieValidator.isValid});
    this.organeNom = [];
    this.organeElement = [];
    this.contentDimensions = {};
  }

  ngOnInit(){
    //Réuperation des données (id et nom) de la table cancer
    this.organe.makeCancerList().then((liste) =>{
      this.organeNom = liste[0];
      this.organeElement = liste[1];
    });
    this.organeChoix = '';
  }

  ionViewDidEnter(){
    //Si l'utilisateur est inactif, une alerte est envoyée avec la possibilité de continuer ou de recommencer le questionnaire.
    this.inactif.idleSet(this.navCtrl);
    this.contentDimensions = this.content.getContentDimensions();
    if (this.contentDimensions.contentHeight + 50 < this.contentDimensions.scrollHeight) {
      this.showScrollFabMaladie = true;
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
        this.showScrollFabMaladie = true;
      } else {
        this.showScrollFabMaladie = false;
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
   * Fonction qui permet l'entrée du nom de l'organe primitif atteint.
   * @method organeOui
   * @param {} - aucun paramètre n'est passé à la fonction.
   * @returns {} - aucune valeur n'est retournée par la fonction.
   */
  organeOui() {
    this.questionOrgane = true;
    this.showOrganeModal();
  }

  /**
   * Fonction qui supprime l'entrée du nom de l'organe primitif atteint.
   * @method organeNon
   * @param {} - aucun paramètre n'est passé à la fonction.
   * @returns {} - aucune valeur n'est retournée par la fonction.
   */
  organeNon() {
    this.questionOrgane = false;
    this.maladieForm.patchValue({organeForm: ''});
    this.maladieForm.patchValue({nom_organeForm: ''});
    this.organeChoix = '';
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
    //Création de la page modale en insérant les textes nécessaires
    this.translate.get('TITRE_MODAL_ORGANE').subscribe(value => {
      this.organeTitre = value;
    });
    this.translate.get('PLACEHOLDER_MODAL_ORGANE').subscribe(value => {
      this.organePlaceholder = value;
    });
    //Création de la page d'autocompletion
    let modal = this.modalCtrl.create(Autocomplete, {entryAutocomplete: this.organeChoix, dataAutocomplete: this.organeNom, titreAutocomplete: this.organeTitre, placeholderAutocomplete: this.organePlaceholder});
    //Traitements lors de la fermeture de la page d'autocompletion
    modal.onDidDismiss(data => {
      //Vérification que la donnée passée existe et n'est pas seulement des espaces
      if (data && data.replace(/\s/g, '').length!=0){
        //Récupération des données de la page autocompletion
        this.organeChoix = data;
        //Comparaison avec la table cancer
        var organeData = this.organeElement.find((val)=>{
          let strVal = this.diacritics.replaceDiacritics(val.nom.toLowerCase());
          let strData = this.diacritics.replaceDiacritics(data.toLowerCase());
          if(strVal === strData){
            return val;
          }
        });
        //Attribution de valeurs aux champs du formulaire (organeForm et nom_organeForm)
        if(organeData){
          this.maladieForm.patchValue({organeForm: organeData.id});
          this.maladieForm.patchValue({nom_organeForm: organeData.nom});
        } else {
          this.maladieForm.patchValue({organeForm: 'AUCUN'});
          this.maladieForm.patchValue({nom_organeForm: this.organeChoix});
        }
      }
    });
    //Affichage de la page d'autocompletion
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
    //Booléen qui indique s'il faut ou non afficher les erreurs sur la page HTML
    this.submitAttempt = true;
    if(this.maladieForm.valid){
      //Stockage local des données remplies dans cette page de formulaire
      this.localstockage.setData(this.maladieForm.value).then((message) => {
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
        //Navigation à la page du formulaire - Thérapies
        this.navCtrl.push(Therapies);
      });
    }
  }
}