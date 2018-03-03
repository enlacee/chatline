import { Component, Input } from '@angular/core';
import { User } from '../models/user';
import { Router } from '@angular/router';

import { GroupuserService } from '../groupuser.service';
import { ChatService } from '../chat.service';

@Component({
	selector: 'app-chat',
	templateUrl: './chat.component.html',
	styleUrls: ['./chat.component.scss'],
	providers: [GroupuserService, ChatService]
})
export class ChatComponent {

	@Input() user:User;
	@Input() groupsItems:Object;
	public dataOpenTheTab;
	public statusCode;

	constructor(
		private _router: Router,
		private _groupuserService: GroupuserService,
		private _chatService: ChatService,

	) {
		// get data user before to loged
		this.user = JSON.parse(localStorage.getItem('currentUser'));

		// get data all groups
		let params = [];
		params.push({'id': 'id_user', 'value': this.user.id_user});
		this._chatService.getData(params)
			.subscribe(
				result => {
					this.groupsItems = result;
					console.log('groupsItems', result);
				},
				error => {
					alert("Error en la petición user");
				}
			);

	}

	logout(event){
		event.preventDefault();
		if (window.confirm("Está seguro de querer salir?")) {
			localStorage.removeItem('currentUser');
			this._router.navigate(['login']);
		}
	}

	/**
	 * muestra tab y lista los usuarios que pertenecen al grupo
	 */
	openTheTab(event, id_group) {
		console.log('openTheTab id_group', id_group);
		var i, tabcontent, tablinks;

		// Get all elements with class="tabcontent" and hide them
		tabcontent = document.getElementsByClassName("tabcontent");
		for (i = 0; i < tabcontent.length; i++) {
			tabcontent[i].style.display = "none";
		}

		// Get all elements with class="tablinks" and remove the class "active"
		tablinks = document.getElementsByClassName("tablinks");
		for (i = 0; i < tablinks.length; i++) {
			tablinks[i].className = tablinks[i].className.replace(" active", "");
		}

		// Show the current tab, and add an "active" class to the button that opened the tab
		let containerGroup = document.getElementById(id_group);
		containerGroup.style.display = "block";
		event.currentTarget.className += " active";


		// Ajax load (all user into group)
		this.loadDataGroupUserByGroupId(id_group);
	}

	// load reset data
	loadDataGroupUserByGroupId(id_group) {
		this._groupuserService.getDataGroupById(id_group)
			.subscribe(article => {
				this.dataOpenTheTab = article;
			},
			errorCode =>  this.statusCode = errorCode);
	}


}
