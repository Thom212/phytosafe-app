import { Injectable } from '@angular/core';
import { Http, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

/**
 * @class Api - Ce service prend en charge les requêtes vers l'API REST côté client. Il faut, avant toute chose, déterminer l'URL de l'API.
 * Les données échangées doivent être en format JSON. Les données reçues doivent toujours commencer par le champ 'status' :
 * ```json
 * {
 *   status: 'success',
 *   formres: {
 *     // ce champ doit contenir a minima l'id du formulaire, stocké sous le nom idForm
 *   }
 * }
 * ```
 * Si le champ `status` n'est pas un `success`, une erreur est envoyée.
 */

@Injectable()
export class Api {
  
  url: string = 'http://192.168.1.4:3000/api/v1';//'http://51.255.38.12/api/v1';

  constructor(public http: Http) {}

  /**
   * Méthode qui envoie une requête GET à l'API pour récupérer des données. 
   * @method get
   */
  get(endpoint: string, params?: any, options?: RequestOptions) {
    if (!options) {
      options = new RequestOptions();
    }

    // Support easy query params for GET requests
    if (params) {
      let p = new URLSearchParams();
      for (let k in params) {
        p.set(k, params[k]);
      }
      // Set the search field if we have params and don't already have
      // a search field set in options.
      options.search = !options.search && p || options.search;
    }

    return this.http.get(this.url + '/' + endpoint, options);
  }

  /**
   * Méthode qui envoie une requête POST à l'API pour envoyer des données sur le serveur. 
   * Cette méthode est utilisée lorsque l'URI pour accéder à la ressource n'est pas encore créée et sera créée côté serveur. Les données envoyées seront donc dans un sous-domaine de l'URI utilisée pour envoyer les données.
   * @method post
   */
  post(endpoint: string, body: any, options?: RequestOptions) {
    return this.http.post(this.url + '/' + endpoint, body, options);
  }

  /**
   * Méthode qui envoie une requête PUT à l'API pour envoyer des données sur le serveur. 
   * Cette méthode est utilisée lorsque l'URI pour accéder à la ressource est déterminée par le client : c'est l'URI utilisée pour envoyer les données.
   * @method put
   */
  put(endpoint: string, body: any, options?: RequestOptions) {
    return this.http.put(this.url + '/' + endpoint, body, options);
  }

  /**
   * Méthode qui envoie une requête DELETE à l'API pour supprimer des données sur le serveur.
   * @method delete
   */
  delete(endpoint: string, options?: RequestOptions) {
    return this.http.delete(this.url + '/' + endpoint, options);
  }

  /**
   * Méthode qui envoie une requête PATCH à l'API pour envoyer des données sur le serveur. 
   * Cette méthode est utilisée lorsque les données envoyées sont une mise à jour d'une ressource déjà identifiée. Les données correspondent donc à un format attendu.
   * @method patch
   */
  patch(endpoint: string, body: any, options?: RequestOptions) {
    return this.http.patch(this.url + '/' + endpoint, body, options);
  }
}
