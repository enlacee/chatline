import { Injectable } from '@angular/core';

// import other componenst usefull
import{ Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

// Permitimos que este objeto se pueda inyectar con la DI
@Injectable()
export class UserService {

	constructor(private _http: Http) {}

	getUsers() {
		return this._http.get('http://local.chatlineapi.com/users')
			.map(res => res.json());
	}

	// authenticate basic
	login(username: string, password: string) {
		return this._http.post('http://local.chatlineapi.com/login', { username: username, password: password })
			.map(res => res.json());

		// return this._http.post<any>('http://local.chatlineapi.com/login', { username: username, password: password })
		// 	.map(res => res.json());
	}
}
