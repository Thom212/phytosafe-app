import {Component} from '@angular/core';
import {ViewController, LoadingController, NavParams} from 'ionic-angular';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { LocalStockage } from '../../providers/localstockage';

@Component({
  selector: 'center',
  templateUrl: 'center.html'
})

export class Center {
  centerList: any;
  centerModalPicked: string;
  titreModalCenter: string;
  centerForm: FormGroup;
  contentLoader: string;
  showForm: boolean = true;

  constructor (public viewCtrl: ViewController, public loadingCtrl: LoadingController, public formBuilder: FormBuilder, public params: NavParams, public localstockage: LocalStockage, public translate: TranslateService) {
    this.translate.get('CONTENT_LOADER_CENTER').subscribe(value => {
      this.contentLoader = value;
    });
    this.centerList = this.params.get('centerList');
    this.centerModalPicked = this.params.get('centerModalPicked');
    this.titreModalCenter = this.params.get('titreModalCenter');
    this.centerForm = formBuilder.group({
      setCenter:  [this.centerModalPicked]
    });
  }

  /**
   * Fonction qui supprime la page modale ouverte.
   * @method dismiss
   * @param {} - aucun paramètre n'est passé à la fonction.
   * @returns {} - aucune valeur n'est retournée par la fonction.
   */
  dismiss() {
    this.showForm = false;
    this.localstockage.setData(this.centerForm.value).then((message) => {
      this.viewCtrl.dismiss();
    });
  }
}
