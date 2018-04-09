import { Component, Input } from '@angular/core';
import { UserService } from '../user.service';
import { Subscriber } from 'rxjs/Subscriber';
import { Router } from '@angular/router';

import { VariableGlobalService } from '../variable-global.service';

@Component({
	selector: 'app-login-form',
	templateUrl: './login-form.component.html',
	styleUrls: ['./login-form.component.scss'],
	providers: [UserService]
})

export class LoginFormComponent {

	@Input() isAdmin: boolean;

	public ShowLogin:boolean;
	public ShowRecoverPass:boolean;
	public users;
	public errorMessage;

	constructor(
		private _usersService: UserService, 
		private _router: Router,
		private _variableGlobal: VariableGlobalService
	) {
		this.ShowLogin = true;
		this.ShowRecoverPass = false;
	}

	// login user authentication
	loginUser(event) {
		event.preventDefault();
		var form = event.target;
		var formdat = new FormData();
		formdat.append('username', form.username.value);
		formdat.append('password', form.password.value);
		if (typeof(form['is-admin']) !== 'undefined') {
			formdat.append('is-admin', 'true');
		}

		this._usersService.login(formdat)
			.subscribe(
				result => {

					if (typeof(result) !== 'undefined' && result !== false) {
						if (typeof(form['is-admin']) !== 'undefined') {
							localStorage.setItem('currentUserAdmin', JSON.stringify(result));
							this._router.navigate(['admin']);
						} else if (
							typeof(result['id_rol']) !== 'undefined' &&
							result['id_rol'] === 2 ||
							result.id_rol === 3
						) {
							localStorage.setItem('currentUser', JSON.stringify(result));
							this._router.navigate(['']);
							console.log('Ingresaste to room chat!');
						}
					} else {
						alert('Usuario sin acceso');
					}
				},
				error => {
					this.errorMessage = <any>error;

					if(this.errorMessage !== null){
						console.log(this.errorMessage);
						alert("Error en la petición");
					}
				}
			)

		return false;
	}

	// recover password
	recoverPasswordUser(event) {
		event.preventDefault();
		var form = event.target;
		var formdat = new FormData();
		var validation = false;

		if ( this._variableGlobal.validateEmail(form.email.value) === true ) {
			formdat.append('email', form.email.value);

			// send post
			this._usersService.forgotPassword(formdat).subscribe(
				result => {
					console.log('result forgot password', result);
					alert('Danos unos segundos estamos enviandote un correo');
				}
			);
		} else {
			alert('El formato del correo es incorrecto');
		}
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
