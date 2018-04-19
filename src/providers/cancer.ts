import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Api } from './api';
import { LocalStockage } from './localstockage';

/**
 * @class Cancer - Ce service utilise les requêtes définies dans le fichier providers/api pour faire l'interface entre le client et le serveur (et la table Cancer).
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
export class Cancer {

  public subCreate: any;

  constructor(public http: Http, public api: Api, public localstockage: LocalStockage) { }

  /**
   * Méthode qui envoie une requête GET pour récupérer la liste des traitements enregistrés dans la base côté serveur. 
   * @method getCancer
   * @requires providers/localstockage - la fonction utilise la méthode setData.
   * @requires providers/api - la fonction utilise la méthode get.
   * @param {} - aucun paramètre n'est passé à la méthode.
   * @returns {Observable} - un observable est renvoyé pour suivre l'état de la requête. 
   */
  getCancer() {
    let seq = this.api.get('cancers/').share();
    return seq;
  }

  /**
   * Fonction qui permet 
   * @method makeCancerList
   * @requires providers/cancer - elle appelle la méthode getCancer.
   * @param {} - aucun paramètre n'est passé à la fonction..
   * @returns {array} - un tableau avec les organes est retournée par la fonction.
   */
  makeCancerList(){

    return new Promise((resolve,reject) => {
      let organeList = [];
      let organeTab = [];
      this.getCancer().toPromise().then((res) => {
        var auxTab = res.json().data;
        auxTab.forEach((element) => {
          organeList.push(element.nom.charAt(0).toUpperCase() + element.nom.slice(1).toLowerCase());
          organeTab.push(element);
        })
        return organeList;
      }).catch((err)=>{
        console.error('ERROR', err);
      });
      resolve([organeList,organeTab]);
    });
  } 
}