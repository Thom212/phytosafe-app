import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Api } from './api';
import { LocalStockage } from './localstockage';

/**
 * @class Traitement - Ce service utilise les requêtes définies dans le fichier providers/api pour faire l'interface entre le client et le serveur (et la table Traitement).
 * Les réponses du serveur aux requêtes envoyées sont des objets JSON, et doivent commencer par le champ `status` : 
 * ```json
 * {
 *   status: 'success',
 *   traitres: {
 *     // ce champ doit contenir a minima l'id du formulaire, stocké sous le nom idForm.
 *   }
 * }
 * ```
 * Si le champ `status` n'est pas un `success`, une erreur est envoyée.
 */

@Injectable()
export class Traitement {

  public subCreate: any;

  constructor(public http: Http, public api: Api, public localstockage: LocalStockage) { }

  /**
   * Méthode qui envoie une requête GET pour récupérer la liste des traitements enregistrés dans la base côté serveur. 
   * @method getTrait
   * @requires providers/api - la fonction utilise la méthode get.
   * @param {string} - le type de traitement est passé à la méthode.
   * @returns {Observable} - un observable est renvoyé pour suivre l'état de la requête. 
   */
  getTrait(type) {
    let seq = this.api.get('traitements/' + type).share();
    return seq;
  }

  /**
   * Fonction qui permet de faire un tableau avec les traitements.
   * @method makeTraitList
   * @requires providers/traitement - elle appelle la méthode getTrait.
   * @param {array} - un tableau de référence des traitements à sélectionner est passée à la fonction.
   * @returns {array} - deux tableaux avec les traitements et leurs noms sont retournés par la fonction.
   */
  makeTraitList(refArray){
    return new Promise((resolve,reject) => {
      let traitementList = [];
      let traitementTab = [];
      refArray.forEach((reference) => {
        this.getTrait(reference).toPromise().then((res) => {
          var auxTab = res.json().data;
          auxTab.forEach((element) => {
            if (element.nom !== 'autres_phyto' && element.nom !== 'autres_ttcan') {
              traitementList.push(element.nom.charAt(0).toUpperCase() + element.nom.slice(1).toLowerCase());
              traitementTab.push(element);
            }else{
              console.log(element.id);
            }
          });
        }).catch((err)=>{
          console.error('ERROR', err);
        });
      });
      resolve([traitementList,traitementTab]);
    });
  }
}