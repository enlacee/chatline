import { Component, OnInit } from '@angular/core';
import { LoginFormComponent } from '../login-form/login-form.component';

@Component({
	selector: 'app-login-form-admin',
	template: `
		<app-login-form [isAdmin]="isAdminVariable"></app-login-form>
	`,
	// styles: ['h1 { background-color: red; }']
})
export class LoginFormAdminComponent implements OnInit {

	isAdminVariable = true;

	constructor() { }

	ngOnInit() {
	}

}
