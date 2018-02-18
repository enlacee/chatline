import { Injectable } from '@angular/core';

@Injectable()

export class VariableGlobalService {

	public apiURL:string = 'http://local.chatlineapi.com/v1';

	constructor() {	}

	// Get global variable
	getData() {
		return {
			varibale1: 'output1',
			variable2: 'output2'
		}
	}

}
