import { Component, Input } from '@angular/core';
import { User } from '../models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {

	@Input() user:User;

	constructor(private _router: Router) {
		// get data user  before loged
		this.user = JSON.parse(localStorage.getItem('currentUserAdmin'));
	}

	logout(event){
		event.preventDefault();
		if (window.confirm("Está seguro de querer salir?")) {
			localStorage.removeItem('currentUserAdmin');
			this._router.navigate(['logina']);
		}
	}
}
