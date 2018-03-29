import { Injectable } from '@angular/core';

@Injectable()

export class VariableGlobalService {

	public apiURL:string = 'http://local.chatlineapi.com/v1';
	public apiURLsocket: string = 'http://local.chatlineapi.com:2020';

	constructor() {	}

	// Get global variable
	getData() {
		return {
			varibale1: 'output1',
			variable2: 'output2'
		}
	}

	/**
	 * Obtener el Numero o numeros del string
	 * @param stringNumber
	 * @returns integer | bool
	 */
	getNumberFromString(stringNumber = '') {
		var thenum = stringNumber.replace( /^\D+/g, ''); // replace all leading non-digits with nothing

		return isNaN(parseInt(thenum)) ? false : parseInt(thenum);
	}

}
