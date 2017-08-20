import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

/**
 * @class LocalStockage - Ce service permet d'utiliser le stockage local de l'appareil.
 */

@Injectable()
export class LocalStockage {

  constructor(public storage: Storage) { }

  /**
   * Méthode qui permet d'enregistrer des données localement. les données sont enregistrées par paire clé/valeur.
   * @method setData
   * @param {Objet} - un objet est passé à la méthode qui enregistre indépendemment chacune de ses propriétés.
   * @returns {Promise} - une promesse est renvoyée qui se termine lorsque l'ensemble des données a été enregistré. 
   */
  setData(data) {
    return new Promise((resolve,reject) => {
      //Décomposition des propriétés de l'objet en paire clé/valeur
      for(var propertyName in data) {
        console.log(propertyName + ' en cours d\'enregistrement : ' + data[propertyName]);
        this.storage.set(propertyName,data[propertyName]);//Enregistrement de la paire clé/valeur
      }
      resolve('enregistré !');
    });
  }

  /**
   * Méthode qui récupère une donnée stockée localement à partir de sa clé.
   * @method getData 
   * @param {string} - le nom de la clé identifiant la donnée stockée.
   * @returns {promise} - une promesse est renvoyée qui se termine lorsque la donnée est récupérée. 
   */
  getData(data){
      return this.storage.get(data);
  }

  /**
   * Méthode qui permet de supprimer des données stockées localement. Seul l'identifiant d'un formulaire n'est pas supprimé.
   * @method removeData 
   * @param {Objet} - l'objet dont les valeurs des propriétés doivent être supprimées.
   * @returns {Promise} - une promesse est renvoyée qui se termine lorsque les données sont supprimées. 
   */
  removeData(data){
    return new Promise((resolve, reject) => {
      for(var propertyName in data) {
        //L'identifiant unique, qui peut être une des propriétés de l'objet data, n'est pas supprimé.
        if (propertyName!="idForm"){
          this.storage.remove(propertyName).then(() => {
            console.log('donnée supprimée');});
          console.log(propertyName + ' supprimée');
        }
      }
      resolve('Supression des données');
    });
  }

  /**
   * Méthode qui récupère l'ensemble des données stockées localement.
   * @method getAllData
   * @param {} - aucun paramètre n'est passé à la méthode.
   * @returns {Promise} - une promesse est renvoyée avec les valeurs des donnés stockées sous la forme d'un objet. 
   */
  getAllData(){
    let data = {};
    return new Promise((resolve, reject) => {
      this.storage.forEach( (value, key, index) => {
        if (typeof key === 'string' && key.endsWith('Form')){
          data[key]=value;
          console.log('la valeur est ' + value + ' et la key est ' + key);
        }
      });
      resolve(data);
    }); 
  }

  /**
   * Méthode qui supprime TOUTES les données stockées localement.
   * @method clearAllData 
   * @param {} - aucun paramètre n'est passé à la méthode.
   * @returns {Promise} - une promesse est renvoyée lorsque toutes les données sont supprimées. 
   */
  clearAllData(){
      return this.storage.clear();
  }
}