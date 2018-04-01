import { Injectable } from '@angular/core';

import { Http, Response, Headers/*, URLSearchParams*/, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { VariableGlobalService } from './variable-global.service';
import { GroupUser } from './models/group-user';
import { ArrayType } from '@angular/compiler/src/output/output_ast';

@Injectable()
export class GroupuserService {

	private apiURL;

	constructor(
		private _variableGlobal: VariableGlobalService,
		private _http: Http
	) {
		this.apiURL = this._variableGlobal.apiURL + '/groups-users';
	}
	//Fetch article by id
	public getArticleById(articleId: string): Observable<GroupUser> {
		// let cpHeaders = new Headers({ 'Content-Type': 'application/json' });
		// let options = new RequestOptions({ headers: cpHeaders });

		return this._http.get(this.apiURL + "/" + articleId)
			.map(res => res.json());
			//    .catch(this.handleError);
	}
	public getDataGroupById(articleId: string, id_user): Observable<ArrayConstructor> {

		return this._http.get(this.apiURL, {params:
			{'id_group': articleId, 'except_id_user': id_user}
		})
			.map(res => res.json());
	}
	//Create article
	public createArticle(article: GroupUser):Observable<number> {
		let cpHeaders = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: cpHeaders });

		return this._http.post(this.apiURL, article, options)
			.map(res => res.json());
	}
	//Update article
	// updateArticle(article: GroupUser):Observable<number> {
	// 	let cpHeaders = new Headers({ 'Content-Type': 'application/json' });
	// 	let options = new RequestOptions({ headers: cpHeaders });

	// 	console.log(this.apiURL + "/" + article.id_group);
	// 	return this._http.put(this.apiURL + "/" + article.id_group, article, options)
	// 		.map(res => res.json());

	// }
	//Delete article
	deleteArticleById(articleId: string): Observable<number> {
		let cpHeaders = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: cpHeaders });
		return this._http.delete(this.apiURL + "/" + articleId)
			.map(res => res.json());
	}
}
