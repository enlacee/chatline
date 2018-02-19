import { Injectable } from '@angular/core';

// import other componenst usefull
import{ Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { VariableGlobalService } from './variable-global.service';

// Permitimos que este objeto se pueda inyectar con la DI
@Injectable()
export class UserService {

	private theData;

	constructor(private _variableGlobal: VariableGlobalService, private _http: Http) {
		this.theData = _variableGlobal.getData();
	}

	getUsers() {

		return this._http.get(this._variableGlobal.apiURL + '/users')
			.map(res => res.json());
	}

	// authenticate basic
	login(formdata) {
		return this._http.post(this._variableGlobal.apiURL + '/users-login', formdata)
			.map(res => res.json());
	}
}
