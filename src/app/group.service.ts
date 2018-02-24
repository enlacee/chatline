import { Injectable } from '@angular/core';

import { Http, Response, Headers/*, URLSearchParams*/, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { VariableGlobalService } from './variable-global.service';
import { Group } from './models/group';

@Injectable()
export class GroupService {

	private apiURL;

	constructor(
		private _variableGlobal: VariableGlobalService,
		private _http: Http
	) {
		this.apiURL = this._variableGlobal.apiURL + '/groups';
	}

	public getData() {
		return this._http.get(this.apiURL)
			.map(res => res.json());
	}
	//Fetch article by id
	public getArticleById(articleId: string): Observable<Group> {
		let cpHeaders = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: cpHeaders });

		return this._http.get(this.apiURL + "/" + articleId)
			.map(res => res.json());
			//    .catch(this.handleError);
	}
	//Create article
	public createArticle(article: Group):Observable<number> {
		let cpHeaders = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: cpHeaders });

		return this._http.post(this.apiURL, article, options)
			.map(res => res.json());
	}
	//Update article
	updateArticle(article: Group):Observable<number> {
		let cpHeaders = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: cpHeaders });

		console.log(this.apiURL + "/" + article.id_group);
		return this._http.put(this.apiURL + "/" + article.id_group, article, options)
			.map(res => res.json());

	}
	//Delete article
	deleteArticleById(articleId: string): Observable<number> {
		let cpHeaders = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: cpHeaders });
		return this._http.delete(this.apiURL + "/" + articleId)
			.map(res => res.json());
	}
}
