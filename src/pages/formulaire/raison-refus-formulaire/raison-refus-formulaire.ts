import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { NavController, ModalController, Content } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

//page suivante
import { RefusFormulaire } from '../../formulaire/refus-formulaire/refus-formulaire';

//Providers
import { Formulaire } from '../../../providers/formulaire';
import { LocalStockage } from '../../../providers/localstockage';
//import { Traitement } from '../../../providers/traitement';
//import { Diacritics } from '../../../providers/diacritics';
//import { Inactif } from '../../../providers/inactif';


@Component({
  selector: 'raison-refus-formulaire',
  templateUrl: 'raison-refus-formulaire.html'
})

export class RaisonRefusFormulaire implements OnInit {

  @ViewChild(Content) content: Content;

  refusForm: FormGroup;
  submitAttempt: boolean = false;
  showScrollFabTherapies: boolean = false;
  contentDimensions: any;
  
  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public zone: NgZone, public localstockage: LocalStockage, public formulaire: Formulaire, public translate: TranslateService, public formBuilder: FormBuilder) {
    
    
    this.refusForm = formBuilder.group({
      raisonRefusForm:  ['', Validators.required]
    });
    this.contentDimensions = {};
  }

  ngOnInit(){

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

  nextPage() {
    this.submitAttempt = true;
    if(this.refusForm.valid){
      this.localstockage.setData(this.refusForm.value).then((message) => {
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
      //Navigation vers la page de prise en compte du refus du formulaire
      this.navCtrl.push(RefusFormulaire);
    }
  }
}

 


