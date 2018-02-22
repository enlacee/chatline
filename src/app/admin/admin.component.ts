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

		let data = JSON.parse(localStorage.getItem('currentUser'));
		this.user = data;

		console.log('this.user', this.user);
	}

	logout(event){
		event.preventDefault();
		if (window.confirm("Está seguro de querer salir?")) {
			localStorage.removeItem('currentUser');
			this._router.navigate(['logina']);
		}
	}
}
