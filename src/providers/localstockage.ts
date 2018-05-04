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
    let promises = [];
    //Décomposition des propriétés de l'objet en paire clé/valeur
    for(var propertyName in data) {
      console.log(propertyName + ' en cours d\'enregistrement : ' + data[propertyName]);
      promises.push(this.storage.set(propertyName,data[propertyName]));//Enregistrement de la paire clé/valeur
    }
    return new Promise((resolve,reject) => {
      Promise.all(promises).then(() => {
        resolve('Enregistré !');
      });
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
   * Méthode qui permet de supprimer des données stockées localement. Seul l'identifiant d'un formulaire n'est pas supprimé, et les données des autres formulaires non envoyés sur le réseau.
   * @method removeData 
   * @param {Objet} - l'objet dont les valeurs des propriétés doivent être supprimées.
   * @returns {Promise} - une promesse est renvoyée qui se termine lorsque les données sont supprimées. 
   */
  removeData(data){
    let promises = [];
    for(var propertyName in data) {
      //L'identifiant unique, qui peut être une des propriétés de l'objet data, n'est pas supprimé.
      if (propertyName!="idForm" && !propertyName.startsWith('Saved_Form') && propertyName!="setCenter"){
        promises.push(this.storage.remove(propertyName));
      }
    }
    return new Promise((resolve, reject) => {
      Promise.all(promises).then(() => {
        resolve('Supression des données !');
      });
    });
  }

  /**
   * Méthode qui récupère l'ensemble des données stockées localement.
   * @method getAllData
   * @param {} - aucun paramètre n'est passé à la méthode.
   * @returns {Promise} - une promesse est renvoyée avec les valeurs des donnés stockées sous la forme d'un objet. 
   */
  getAllData(){
    let dataStorage = {};
    return new Promise((resolve, reject) => {
      this.storage.forEach((value, key, index) => {
        if (typeof key === 'string' && key.endsWith('Form')){
          dataStorage[key]=value;
          //console.log('la valeur est ' + value + ' et la key est ' + key);
        }
      }).then(() => {      
        resolve(dataStorage);
      });
    }); 
  }

  /**
   * Méthode qui permet de supprimer des données stockées localement. Seules les données des autres formulaires non envoyés sur le réseau ne sont pas supprimées.
   * @method clearAllData 
   * @param {} - l'objet dont les valeurs des propriétés doivent être supprimées.
   * @returns {Promise} - une promesse est renvoyée qui se termine lorsque les données sont supprimées. 
   */
  clearAllData(){
    return new Promise((resolve, reject) => {
      this.storage.forEach( (value, key, index) => {
        if (!key.startsWith('Saved_Form') && key !== 'setCenter'){
          this.storage.remove(key).then(() => {
            //console.log(key + ' supprimée : ' + value);
          });
        }
      }).then(() => {      
        resolve('Supression des données');
      });
    });
  }

  /**
   * Méthode qui enregistre sous un nom particulier les données qui n'ont pas pu être envoyées sur le serveur, pour une prohcaine connexion.
   * @method storeAllData
   * @param {Objet} - l'objet dont les valeurs des propriétés doivent être enregistrées.
   * @returns {Promise} - une promesse est renvoyée lorsque toutes les données ont été enregistrées.
   */
  storeAllData(data){
    var currentTime = new Date();
    let key = 'Saved_Form' + String(currentTime);
    return this.storage.set(key,JSON.stringify(data));
  }

  /**
   * Méthode qui récupère l'ensemble des données qui n'ont pas été envoyées sur le serveur mais qui ont été stockées localement.
   * @method getStoreData
   * @param {} - aucun paramètre n'est passé à la méthode.
   * @returns {Promise} - une promesse est renvoyée avec les valeurs des donnés stockées sous la forme d'un objet. 
   */
  getStoreData(){
    var dataStorage = {};
    return new Promise((resolve, reject) => {
      this.storage.forEach( (value, key, index) => {
        if (key.startsWith('Saved_Form')){
          dataStorage[key] = value;
          console.log(key + ' récupérée : ' + value);
        }
      }).then(() => {
        resolve(dataStorage);
      });
    }); 
  }

  /**
   * Méthode qui supprime une paire key/value stockée
   * @method clearData
   * @param {string} - la key de la paire à supprimer est passée à la méthode.
   * @returns {Promise} - une promesse est renvoyée lorsque la donnée a été supprimée. 
   */
  clearData(key){
    return this.storage.remove(key).then(() => {
      //console.log(key + ' supprimée');
    });
  }
}