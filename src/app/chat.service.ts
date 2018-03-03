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

	// Fetch All
	getData(params:any[]) {
		let myHeaders = new Headers();
		myHeaders.append('Content-Type', 'application/json');

		let myParams = new URLSearchParams();
		let idUser = false;
		console.log('params', params);

		params.forEach(element => {
			console.log('element.id', element.id);
			console.log('element.value', element.value);
			myParams.append(element.id, element.value);
			if (element.id == 'id_user'){
				idUser = element.value;
			}
		});
		// params.forEach(element => {
		// 	myParams.append('id', bookId);
		// });


		let options = new RequestOptions({ headers: myHeaders, params: myParams });

		return this._http.get(this._variableGlobal.apiURL + '/chats-groups?id_user=' + idUser, options)
			.map(res => res.json());
	}
}
