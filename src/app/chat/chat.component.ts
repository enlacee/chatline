import { Component, Input, OnInit } from '@angular/core';
import { User } from '../models/user';
import { Router } from '@angular/router';

import { GroupuserService } from '../groupuser.service';
import { ChatService } from '../chat.service';
import { VariableGlobalService } from '../variable-global.service';

import * as io from 'socket.io-client';

@Component({
	selector: 'app-chat',
	templateUrl: './chat.component.html',
	styleUrls: ['./chat.component.scss'],
	providers: [GroupuserService, ChatService],
})
export class ChatComponent implements OnInit {

	@Input() user:User;

	public groupsItems:any[] = [];
	public indexGroupSelected = 0;
	public groupUsers:any[] = [];
	public dataSocket = [];
	public statusCode;
	public id_group_user: number = 0;

	private socket;

	constructor(
		private _router: Router,
		private _groupuserService: GroupuserService,
		private _chatService: ChatService,
		private _variableGlobal: VariableGlobalService,

	) {	}

	ngOnInit(): void {
		// load current user
		this.user = JSON.parse(localStorage.getItem('currentUser'));

		// load groups
		this._chatService.getlistGroupByIdUser(
				[{'id': 'id_user', 'value': this.user.id_user}]
			)
			.subscribe(
				result => {
					this.groupsItems = result;
					if (typeof(this.groupsItems) !== 'undefined' && this.groupsItems.length > 0) {
						// load users from group
						this.loadDataGroupUserByGroupId(
							this.groupsItems[this.indexGroupSelected].id_group
						);
					}
					console.log('this.groupsItems', this.groupsItems);
					// load tab
				},
				error => {
					alert("Error en la petición user");
				}
			);

		// start socket connect (LOGIN SOCKET)
		this.socket = io(this._variableGlobal.apiURLsocket);
		this.socket.emit('add user', this.user.id_user);

		// *****************************************************
		// Listerners
		// *****************************************************
		// Receive Added Todo
		this.socket.on('login', (data) => {
			console.log('EMIT LOGIN', data);

			this.readDataSocket(data);
			this.dataSocket = data;
		});

		// Receive Added Todo
		this.socket.on('user joined', (data) => {
			console.log('EMIT USER JOINED', data);

			this.readDataSocket(data);
			this.dataSocket = data;
		});

		// cuando el usuario sale del chat
		this.socket.on('user left', (data) => {
			this.readDataSocket(data);
			this.dataSocket = data;
		});

		// notifica llego mensaje a mi & a otros usuarios
		this.socket.on('new message', (data) => {
			console.log("llego los mensajes new message:", data);
		});



	}

	private readDataSocket(data){
		this.setOfflineToUsers();
		var self = this;

		if (typeof(data.usernames) === 'undefined') {
			return;
		}

		// each object
		Object.keys(data.usernames).map(function(objectKey, index) {
			var value = data.usernames[objectKey];
			console.log(value);
			// each all user and set status

			if ( self.groupUsers.length > 0) {
				for (let index = 0; index < self.groupUsers.length; index++) {
					console.log('===', self.groupUsers[index].id_user, value);
					if (self.groupUsers[index].id_user === value) {
						self.groupUsers[index].online = true; console.log('TRUEE', self.groupUsers[index]);
					}
				}
			}
		});

	}
	private setOfflineToUsers(){

		if ( this.groupUsers.length > 0) {
			for (let index = 0; index < this.groupUsers.length; index++) {
				this.groupUsers[index].online = false;
			}
		}
	}

	logout(event){
		event.preventDefault();
		if (window.confirm("Está seguro de querer salir?")) {
			this.socket.emit('user logout');

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
				// find index
				this.findIdGroupUser(article);

				// add users
				this.groupUsers = [];
				for (let index = 0; index < article.length; index++) {
					const element = article[index];
					if (this.user.id_user !== element.id_user) {
						this.groupUsers.push(element);
					}
				}

				this.readDataSocket(this.dataSocket);
			},
			errorCode =>  this.statusCode = errorCode);
	}

	// Find *id_group_user* by id_user
	private findIdGroupUser(data) {
		if (typeof(data) !== 'undefined' && data.length > 0) {
			for (let index = 0; index < data.length; index++) {
				if (data[index].id_user === this.user.id_user) {
					this.id_group_user = data[index].id_group_user;
					return true;
				}

			}
		}
	}



	sendMessage(event, data) {
		event.preventDefault();
		console.log('text', data);

		// this.username = this.user.username;
		// console.log('enviando mensajesss');
		// this._chatService.sendMessage('hola soy pepe lucho', this.socket);
		// this.message = '';
		this.socket.emit('new message', data);
	}

}
