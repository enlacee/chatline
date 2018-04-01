import { Injectable } from '@angular/core';

// import other componenst usefull
import{ Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { VariableGlobalService } from './variable-global.service';
import { User } from './models/user';

// Permitimos que este objeto se pueda inyectar con la DI
@Injectable()
export class UserService {

	private apiURL;

	constructor(
		private _variableGlobal: VariableGlobalService,
		private _http: Http
	) {
		this.apiURL = this._variableGlobal.apiURL + '/users';
	}

	// Fetch All
	getData() {

		return this._http.get(this.apiURL)
			.map(res => res.json());
	}

	// Fetch All
	getDataDiccionary() {

		return this._http.get(this.apiURL + '-diccionary')
			.map(res => res.json());
	}

	// Basic authenticate
	login(formdata) {
		return this._http.post(this._variableGlobal.apiURL + '/users-login', formdata)
			.map(res => res.json());
	}

	// Fetch by id
	public getArticleById(articleId: string): Observable<User> {

		return this._http.get(this.apiURL + "/" + articleId)
			.map(res => res.json());
	}

	// Create
	public createArticle(article: User):Observable<number> {
		let cpHeaders = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: cpHeaders });

		return this._http.post(this.apiURL, article, options)
			.map(res => res.json());
	}

	// Update
	updateArticle(article: User):Observable<number> {
		let cpHeaders = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: cpHeaders });

		return this._http.put(this.apiURL + "/" + article.id_user, article, options)
			.map(res => res.json());
	}

	// Delete
	deleteArticleById(articleId: string): Observable<number> {
		let cpHeaders = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: cpHeaders });
		return this._http.delete(this.apiURL + "/" + articleId)
			.map(res => res.json());
	}

	// others
	getDataRoles() {

		return this._http.get(this._variableGlobal.apiURL + '/roles')
			.map(res => res.json());
	}
}
