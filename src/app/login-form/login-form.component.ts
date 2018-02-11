import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'app-login-form',
	templateUrl: './login-form.component.html',
	styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

	@Input() isAdmin: boolean;

	ShowLogin:boolean;
	ShowRecoverPass:boolean;

	constructor() {
		this.ShowLogin = true;
		this.ShowRecoverPass = false;
	}

	ngOnInit() {

	}

	// login user authentication
	loginUser(event) {
		event.preventDefault();
		var form = event.currentTarget;
		var username = form.elements[0].value;
		var password = form.elements[1].value;

		console.log('data', username, password);

		return false;
	}

	// recover password
	recoverPasswordUser(event) {
		event.preventDefault();
	}

	// function to show content
	showLogin() {
		this.ShowLogin = true;
		this.ShowRecoverPass = false;
	}
	showRecoverPass() {
		this.ShowLogin = false;
		this.ShowRecoverPass = true;
	}
}
