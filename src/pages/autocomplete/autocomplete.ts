import {Component, ViewChild} from '@angular/core';
import {ViewController, NavParams, Searchbar} from 'ionic-angular';

import { Diacritics } from '../../providers/diacritics';

@Component({
  selector: 'autocomplete',
  templateUrl: 'autocomplete.html'
})

export class Autocomplete {
  autocompleteItems;
  autocompleteEntry;

  @ViewChild(Searchbar) searchbar:Searchbar;

  constructor (public viewCtrl: ViewController, public params: NavParams, public diacritics: Diacritics) {
    this.autocompleteItems = [];
    this.autocompleteEntry = {
      query: ''
    };
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.searchbar.setFocus();
    });
  }

  /**
   * Fonction qui supprime la page modale ouverte, en passant comme valeur à la page initiale la valeur entrée par l'utilisateur.
   * @method dismiss
   * @param {} - aucun paramètre n'est passé à la fonction.
   * @returns {} - aucune valeur n'est retournée par la fonction.
   */
  dismiss() {
    this.viewCtrl.dismiss(this.autocompleteEntry.query);
  }

  /**
   * Fonction qui supprime la page modale ouverte, en passant comme valeur à la page initiale la valeur sélectionnée dans la liste proposée (autocompletion).
   * @method chooseItem
   * @param {any} - la valeur sélectionnée dans la liste proposée est passée à la fonction.
   * @returns {} - aucune valeur n'est retournée par la fonction.
   */
  chooseItem(item: any) {
    this.autocompleteEntry.query = item;
    this.viewCtrl.dismiss(item);
  }

  /**
   * Fonction qui, à chaque saisie de l'utilisateur, compare le contenu saisi et la liste proposée pour limiter la liste aux valeurs qui correspondent à la saisie : autocompletion.
   * @method updateSearch
   * @param {} - aucun paramètre n'est passé à la fonction.
   * @returns {string} - une liste mise à jour suite à la nouvelle saisie de l'utilisateur est retournée par la fonction.
   */
  updateSearch() {
    if (this.autocompleteEntry.query == '') {
      this.autocompleteItems = [];
    } else {
      this.autocompleteItems = this.params.get('dataAutocomplete').filter((val)=>{
        let strVal = this.diacritics.replaceDiacritics(val.toLowerCase());
        let strEntry = this.diacritics.replaceDiacritics(this.autocompleteEntry.query.toLowerCase());
        return strVal.indexOf(strEntry) > -1;
      });
    }
  }
}