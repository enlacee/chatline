import { Injectable } from '@angular/core';

import { Http, Response, Headers/*, URLSearchParams*/, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { VariableGlobalService } from './variable-global.service';

@Injectable()
export class ChatService {

	private apiURL;

	constructor(
		private _variableGlobal: VariableGlobalService,
		private _http: Http
	) {
		// this.apiURL = this._variableGlobal.apiURL + '/groups-users';
	}

	// Obtener la lista de gropos que pertenece el usuario
	getlistGroupByIdUser(params:any[]) {
		let myHeaders = new Headers();
		myHeaders.append('Content-Type', 'application/json');
		let myParams = new URLSearchParams();
		let idUser = false;

		params.forEach(element => {
			myParams.append(element.id, element.value);
			if (element.id == 'id_user'){
				idUser = element.value;
			}
		});

		let options = new RequestOptions({ headers: myHeaders, params: myParams });

		return this._http.get(this._variableGlobal.apiURL + '/chats-groups?id_user=' + idUser, options)
			.map(res => res.json());
	}
}
