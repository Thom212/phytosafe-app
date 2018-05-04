import {Component, ViewChild} from '@angular/core';
import {ViewController, NavParams, Searchbar} from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';

import { Diacritics } from '../../providers/diacritics';

@Component({
  selector: 'autocomplete',
  templateUrl: 'autocomplete.html'
})

export class Autocomplete {
  autocompleteItems: any;
  autocompleteData: any;
  autocompleteEntry: string;

  @ViewChild(Searchbar) searchbar:Searchbar;

  constructor (public viewCtrl: ViewController, public params: NavParams, public diacritics: Diacritics, private keyboard: Keyboard) {
    this.autocompleteItems = [];
    this.autocompleteData = this.params.get('dataAutocomplete');
    this.autocompleteEntry = this.params.get('entryAutocomplete');
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.searchbar.setFocus();
      this.keyboard.show();
    });
  }

  /**
   * Fonction qui supprime la page modale ouverte, en passant comme valeur à la page initiale la valeur entrée par l'utilisateur.
   * @method dismiss
   * @param {} - aucun paramètre n'est passé à la fonction.
   * @returns {} - aucune valeur n'est retournée par la fonction.
   */
  dismiss() {
    this.keyboard.close();
    this.viewCtrl.dismiss(this.autocompleteEntry);
  }

  /**
   * Fonction qui supprime la page modale ouverte, en passant comme valeur à la page initiale la valeur sélectionnée dans la liste proposée (autocompletion).
   * @method chooseItem
   * @param {any} - la valeur sélectionnée dans la liste proposée est passée à la fonction.
   * @returns {} - aucune valeur n'est retournée par la fonction.
   */
  chooseItem(item: any) {
    this.autocompleteEntry = item;
    this.keyboard.close();
    this.viewCtrl.dismiss(item);
  }

  /**
   * Fonction qui, à chaque saisie de l'utilisateur, compare le contenu saisi et la liste proposée pour limiter la liste aux valeurs qui correspondent à la saisie : autocompletion.
   * @method updateSearch
   * @param {} - aucun paramètre n'est passé à la fonction.
   * @returns {string} - une liste mise à jour suite à la nouvelle saisie de l'utilisateur est retournée par la fonction.
   */
  updateSearch() {
    if (this.autocompleteEntry == '') {
      this.autocompleteItems = [];
    } else {
      let arrayLength: number = this.autocompleteData.length;
      var i: number = 0;
      var nbItems: number = 0;
      var table = [];
      while (i < arrayLength && nbItems < 20) {
        let strVal = this.diacritics.replaceDiacritics(this.autocompleteData[i].toLowerCase());
        let strEntry = this.diacritics.replaceDiacritics(this.autocompleteEntry.toLowerCase());
        if (strVal.indexOf(strEntry) > -1) {
          table.push(strVal);
          nbItems++;
        }
        i++;
      }
      this.autocompleteItems = table;
    }
  }
}