import { Component, Input } from '@angular/core';
import { UserService } from '../user.service';
import { Subscriber } from 'rxjs/Subscriber';
import { Router } from '@angular/router';

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

	constructor(private _usersService: UserService, private _router: Router) {
		this.ShowLogin = true;
		this.ShowRecoverPass = false;

		this._usersService.getUsers()
			.subscribe(
				result => {
					this.users = result;
					console.log(this.users);
				},
				error => {
					this.errorMessage = <any>error;

					if(this.errorMessage !== null){
						console.log(this.errorMessage);
						alert("Error en la petición");
					}
				}
			)
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
					console.log('result', result);
					if (result) {
						localStorage.setItem('currentUser', JSON.stringify(result));
						this._router.navigate(['admin']);
						// localStorage.setItem('currentUser', JSON.stringify({ token: token, name: name }));
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
