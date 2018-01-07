import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Api } from './api';
import { LocalStockage } from './localstockage';

/**
 * @class Formulaire - Ce service utilise les requêtes définies dans le fichier providers/api pour faire l'interface entre le client et le serveur.
 * Les réponses du serveur aux requêtes envoyées sont des objets JSON, et doivent commencer par le champ `status` : 
 * ```json
 * {
 *   status: 'success',
 *   formres: {
 *     // ce champ doit contenir a minima l'id du formulaire, stocké sous le nom idForm.
 *   }
 * }
 * ```
 * Si le champ `status` n'est pas un `success`, une erreur est envoyée.
 */

@Injectable()
export class Formulaire {

  public subCreate: any;

  constructor(public http: Http, public api: Api, public localstockage: LocalStockage) { }

  /**
   * Méthode qui envoie une requête POST pour créer un nouveau formulaire côté serveur. 
   * La création d'un nouveau formulaire s'accompagne par la création d'un identifiant unique côté serveur, renvoyé dans la réponse du serveur.
   * @method createForm
   * @requires providers/localstockage - la fonction utilise les méthodes setData, removeData.
   * @requires providers/api - la fonction utilise la méthode post.
   * @param {Objet} - un objet est passé à la méthode qui va envoyer chacune des propriétés de l'objet au serveur.
   * @returns {Observable} - un observable est renvoyé pour suivre l'état de la requête. 
   */
  createForm(dataForm) {
    //On ne peut créer qu'un seul formulaire côté serveur. Il faut s'assurer qu'il n'y a déjà pas une requête en cours lorsqu'on envoie une requête de création du formulaire.
    if(this.subCreate) {
       this.subCreate.unsubscribe();
    }
    let seq = this.api.post('newForm/', dataForm).share();
    interface idObjet { idForm: number };
    this.subCreate = seq.map(res => res.json())
      .subscribe(res => {
        // Si la requête est un succès, l'identifiant du formulaire est stocké localement
        if (res.status == 'success') {
          var idCreaForm: idObjet = {idForm : res.data.id}; // Le stockage de l'identifiant du formulaire doit avoir le nom idForm.
          this.localstockage.setData(idCreaForm);
          this.localstockage.removeData(dataForm);//Il faut ensuite supprimer toutes les données qui ont été enregistrées sur le serveur, sauf l'identifiant du formulaire.
        }
      }, err => {
        console.error('ERROR', err);
      });
    return seq;
  }

  /**
   * Méthode qui envoie une requête POST pour faire le lien entre le patient et le formulaire.
   * Ce lien peut être accompagné par la création d'un patient, s'il n'existe pas.
   * @method createForm
   * @requires providers/api - la fonction utilise la méthode patch.
   * @param {any, Objet} - une variable avec la valeur de l'identifiant du formulaire et les données à mettre à jour, sous la forme d'un objet, sont passées à la méthode.
   * @returns {Observable} - un observable est renvoyé pour suivre l'état de la requête. 
   */
  createPatient(dataForm) { 
    //On doit s'assurer que le lien entre le patient et le formulaire n'a été fait qu'une fois : il est préférable d'annuler toute requête déjà existante.
    if(this.subCreate) {
       this.subCreate.unsubscribe();
    }
    
    let seq = this.api.post('createpatient/', dataForm).share();

    this.subCreate = seq.map(res => res.json())
      .subscribe(res => {
        if (res.status == 'success') {
          this.localstockage.removeData(dataForm);//Il faut ensuite supprimer toutes les données qui ont été enregistrées sur le serveur, sauf l'identifiant du formulaire.
        }
      }, err => {
        console.error('ERROR', err);
      });

    return seq;
  }

  /**
   * Méthode qui envoie une requête PATCH pour mettre à jour le formulaire côté serveur. 
   * @method updateForm
   * @requires providers/localstockage - la fonction utilise la méthode removeData.
   * @requires providers/api - la fonction utilise la méthode patch.
   * @param {any, Objet} - une variable avec la valeur de l'identifiant du formulaire et les données à mettre à jour, sous la forme d'un objet, sont passées à la méthode.
   * @returns {Observable} - un observable est renvoyé pour suivre l'état de la requête. 
   */
  updateForm(dataForm) { 
    //On doit s'assurer que les données mises à jour soient mise à jour dans le bon ordre : il est préférable d'annuler toute requête déjà existante.
    if(this.subCreate) {
       this.subCreate.unsubscribe();
    }
    
    let seq = this.api.patch('updateform/', dataForm).share();

    this.subCreate = seq.map(res => res.json())
      .subscribe(res => {
        if (res.status == 'success') {
          this.localstockage.removeData(dataForm);//Il faut ensuite supprimer toutes les données qui ont été enregistrées sur le serveur, sauf l'identifiant du formulaire.
        }
      }, err => {
        console.error('ERROR', err);
      });

    return seq;
  }

  /**
   * Méthode qui envoie une requête GET pour récupérer la liste des informations importantes (nom du cancer, nom des traitements) enregistrés dans la base côté serveur.
   * @method getInfo
   * @requires providers/api - la fonction utilise la méthode get.
   * @param {} - aucun paramètre n'est passé à la méthode.
   * @returns {Observable} - un observable est renvoyé pour suivre l'état de la requête. 
   */
  getInfo(id) {
    let seq = this.api.get('informations/' + id).share();
    return seq;
  }

  /**
   * Méthode qui envoie une requête GET pour récupérer la liste des incompatibilités enregistrés dans la base côté serveur.
   * @method getIncompatibilites
   * @requires providers/api - la fonction utilise la méthode get.
   * @param {} - aucun paramètre n'est passé à la méthode.
   * @returns {Observable} - un observable est renvoyé pour suivre l'état de la requête.
   */
  getIncompatibilites(id) {
    let seq = this.api.get('incompatibilites/' + id).share();
    return seq;
  }
}
