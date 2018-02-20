import { Injectable } from '@angular/core';

import{ Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { VariableGlobalService } from './variable-global.service';

@Injectable()
export class GroupService {

	private theData;

	constructor(private _variableGlobal: VariableGlobalService, private _http: Http) {
		this.theData = _variableGlobal.getData();
	}

	getData() {

		return this._http.get(this._variableGlobal.apiURL + '/groups')
			.map(res => res.json());
	}

}
