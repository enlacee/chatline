import { Injectable } from '@angular/core';

import { Http, Response, Headers/*, URLSearchParams*/, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { VariableGlobalService } from './variable-global.service';

@Injectable()
export class ChatService {

	private apiURL;
	private headerType = new Headers();

	constructor(
		private _variableGlobal: VariableGlobalService,
		private _http: Http
	) {
		this.headerType.append('Content-Type', 'application/json');
	}

	/**
	 * Obtener la lista de grupos que pertenece el usuario
	 * @param params
	 */
	public getlistGroupByIdUser(params:any[]) {
		let myParams = new URLSearchParams();
		let idUser = false;
		let options = {};

		// buscar idUser
		params.forEach(element => {
			myParams.append(element.id, element.value);
			if (element.id == 'id_user'){
				idUser = element.value;
			}
		});
		options = new RequestOptions({ headers: this.headerType, params: myParams });

		return this._http.get(this._variableGlobal.apiURL + '/chats-groups?id_user=' + idUser, options)
			.map(res => res.json());
	}

	/**
	 * Enviar mensaje
	 */
	public sendMessage(data = {}) {
		let options = new RequestOptions({ headers: this.headerType });

		return this._http.post(this._variableGlobal.apiURL + '/messages', data, options)
			.map(res => res.json());
	}

	/**
	 * Obtener los mensajes del usuario
	 * @param data
	 */
	public getMessages(data = {}) {
		// let options = new RequestOptions({ headers: this.headerType });
		let options = new RequestOptions({ headers: this.headerType, params: {} });
		let urlParam = this._variableGlobal.createURLGet(data);

		console.log('urlParam', this._variableGlobal.apiURL + '/messages' + urlParam);
		return this._http.get(this._variableGlobal.apiURL + '/messages' + urlParam)
			.map(res => res.json());
	}

	/**
	 * Obtener los mensajes del grupo
	 * @param data
	 */
	public getMessagesGroup(data = {}) {
		// let options = new RequestOptions({ headers: this.headerType });
		let options = new RequestOptions({ headers: this.headerType, params: {} });
		let urlParam = this._variableGlobal.createURLGet(data);

		console.log('urlParam', this._variableGlobal.apiURL + '/messages' + urlParam);
		return this._http.get(this._variableGlobal.apiURL + '/messages' + urlParam)
			.map(res => res.json());
	}

	/**
	 * subir imagen
	 * @param medaData
	 */
	public uploadFile(uploadData) {

		return this._http.post(this._variableGlobal.apiURL + '/upload-file', uploadData)
			.map(res => res.json());
	}
}
