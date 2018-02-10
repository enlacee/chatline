import { Component } from '@angular/core';

@Component({
	selector: 'app-login-form',
	templateUrl: './login-form.component.html',
	styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent {

	loginUser(event) {
		event.preventDefault();
		var form = event.currentTarget;
		var username = form.elements[0].value;
		var password = form.elements[1].value;

		console.log('data', username, password);

		return false;
	}
}
