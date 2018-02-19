import { Component, Input } from '@angular/core';
import { User } from '../models/user';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {

	@Input() user:User;

	constructor() {

		let data = JSON.parse(localStorage.getItem('currentUser'));
		this.user = data;
		console.log('this.user', this.user);
	}

}
