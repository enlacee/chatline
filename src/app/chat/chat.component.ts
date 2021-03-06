import { Component, Input, OnInit } from '@angular/core';
import { User } from '../models/user';
import { Router } from '@angular/router';

import { GroupuserService } from '../groupuser.service';
import { ChatService } from '../chat.service';
import { UserService } from '../user.service';
import { VariableGlobalService } from '../variable-global.service';

import * as io from 'socket.io-client';

@Component({
	selector: 'app-chat',
	templateUrl: './chat.component.html',
	// styleUrls: ['./chat.component.scss'],
	providers: [GroupuserService, ChatService, UserService],
})
export class ChatComponent implements OnInit {

	@Input() user:User;
	@Input() userDiccinary:any[] = [];

	// element chat users peer
	public indexUsersTabSelected = '';
	public messagesChatUsers:any[] = [];

	// elements chat groups
	public groupsItems:any[] = []; // lista de chat de grupos
	public indexGroupSelected = 0;
	// public groupUsers:any[] = [];
	public groupUsers:any[] = [];

	// others
	public dataSocket = [];
	public statusCode;
	public id_group_user: number = 0;
	public messagesChat:any[] = [];

	private socket;

	constructor(
		private _router: Router,
		private _groupuserService: GroupuserService,
		private _chatService: ChatService,
		private _userService: UserService,
		private _variableGlobal: VariableGlobalService,

	) { }

	ngOnInit(): void {

		// load current user
		var self = this;
		this.user = JSON.parse(localStorage.getItem('currentUser'));

		// load all user (like diccionary)
		this._userService.getDataDiccionary().subscribe(result => {
			this.userDiccinary = result
		});

		// listener js (open url on tab)
		this._variableGlobal.delegate(document, "click", ".messages a", function(event) {
			this.setAttribute("target", "_blank");
		});

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

					// load tab cargar mensajes de sala de chat (seleccionado)
					setTimeout(function(){
						let idGroup = self.groupsItems[self.indexGroupSelected].id_group;
						self.openTheTab(event, idGroup);

						// set autoscroll
						self.setAutoScrollGroup(idGroup);
					}, 1300);
					
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

		// Notifica llegada de mensajes a si mismo & a otros usuarios
		this.socket.on('new message', (data) => {
			var theData = data.message;
			var localEmisor = this.user.id_user;
			console.log("escuchando :event: new message:", data);

			if (theData.chatType === 'group') {
				this.messagesChat.push(data);

			// condicion para usuarios (chat) (solo enviar mensajes al emisor a receptor)
			} else if(
				theData.chatType === 'user' &&
				(theData.emisor === localEmisor || theData.receptor === localEmisor)
			) {
				this.readDataSocketMessage(data);
				this.messagesChatUsers.push(data);
			}

			// set autoscroll
			this.setAutoScrollGroup(data.message.id_group);
		});
	}

	/**
	 * Lee la data que les llega a los usuarios (uno a uno)
	 * @param data
	 */
	private readDataSocketMessage(data) {
		var self = this;
		var dataMessage = typeof(data.message) !== 'undefined' ? data.message : false;
		// console.log('readDataSocketMessage /////', data, this.user.id_user);

		// solo llega este action 'CHAT', al receptor
		if (data.action === 'chat') {

			Object.keys(dataMessage).map(function(objectKey, index) {
				if ( objectKey === 'id_group') {
					// console.log('objectKey', objectKey, dataMessage.emisor);

					// each users and set temp Notification
					if ( self.groupUsers.length > 0) {
						for (let index = 0; index < self.groupUsers.length; index++) {
							let counter = typeof(self.groupUsers[index].tempMessageCounter) === 'undefined' ? 0 : self.groupUsers[index].tempMessageCounter;

							// mostrar las notificaciones
							if (
								self.user.id_user === dataMessage.receptor &&
								self.groupUsers[index].id_user === dataMessage.emisor
							) {
								self.groupUsers[index].tempMessageCounter = ++counter;
								// console.log('CONTADOR', self.groupUsers[index]);
							} else {
								// console.log('ELSE CONTADOR');
							}
						}
					}
				}
			});
		}
	}

	/**
	 * Leer variable re-rendizar la variable contador de mensajes
	 * @param index
	 * @param item
	 */
	trackByHeroes(index: number, item: User ): number {

		return item.tempMessageCounter;
	}

	/**
	 * resetear el estado online de los usuarios a False
	 */
	private setOfflineToUsers(){
		if ( this.groupUsers.length > 0) {
			for (let index = 0; index < this.groupUsers.length; index++) {
				this.groupUsers[index].online = false;
			}
		}
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

			// each all user and set status
			if ( self.groupUsers.length > 0) {
				for (let index = 0; index < self.groupUsers.length; index++) {

					if (self.groupUsers[index].id_user === value) {
						self.groupUsers[index].online = true;
					}
				}
			}
		});
	}

	/**
	 * Cerrar sesión
	 * @param event
	 */
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
	hideALlTab() {
		var tabcontent;

		// Get all elements with class="tabcontent" and hide them
		tabcontent = document.getElementsByClassName("tabcontent");
		for (var i = 0; i < tabcontent.length; i++) {
			tabcontent[i].style.display = "none";
		}
	}

	/**
	 * Mostrar la caja de chat del Grupo
	 * @param event Event OR false
	 * @param idElement
	 */
	openTheTab(event, idElement) {
		var self = typeof(event) === 'object' ? event.currentTarget : false ;
		this.hideALlTab();

		if (self !== false) {
			this.removeActiveTab();
			self.className += " active";
		}

		// Show the current tab, and add an "active" class to the button that opened the tab
		document.getElementById(idElement).style.display = "block";

		// Ajax load (all user into group)
		this.loadDataGroupUserByGroupId(idElement);
		this.loadDataMessageByGroupId(idElement);
	}

	/**
	 * Get all elements with class="tablinks" and remove the class "active"
	 */
	private removeActiveTab() {

		var tablinks = document.getElementsByClassName("tablinks");
		for (var i = 0; i < tablinks.length; i++) {
			tablinks[i].className = tablinks[i].className.replace(" active", "");
		}
	}

	/**
	 * Mostrar la caja de chat del Usuario
	 * @param event
	 * @param data
	 */
	openTabPeer(event, data) {
		var self = event.currentTarget;
		var showUserChat = function() {
			if (document.getElementById('user-chat')) {
				document.getElementById('user-chat').style.display = "block";
			}
		}
		this.hideALlTab();
		this.removeActiveTab();
		this.messagesChatUsers = [];

		// 01: add and remove fontWeight bold to users
		// const listItems = self.parentNode.parentNode.children;
		// for (let index = 0; index < listItems.length; index++) {
		// 	const element = listItems[index].children;
		// 	element[0].style.fontWeight = 'normal';
		// }
		// self.style.fontWeight = 'bold';

		// 02: load data chat
		this._chatService.getMessages(data).subscribe(
			result => {
				console.log(typeof(result));
				if (typeof(result) === 'object') {
					result.forEach(element => {

						this.messagesChatUsers.push({
							message: {
								'emisor': element['id_emisor'],
								'receptor': element['id_emisor'],
								'message': element['text'],
								'id_group': 'user-chat',
								'at_created': element['at_created']
							}}
						);
					});
				} else {
					alert('ocurrio un error al enviar mensaje x1');
				}
			}
		);

		// console.log('this.messagesChatUsers', this.messagesChatUsers);
		this.indexUsersTabSelected = data.receptor;
		showUserChat();

		// set autoscroll
		this.setAutoScrollGroup('user-chat');
	}

	/**
	 * Cargar lista de usuarios por Grupo
	 * @param id_group
	 */
	loadDataGroupUserByGroupId(id_group) {

		this._groupuserService.getDataGroupById(id_group, this.user.id_user)
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

	/**
	 * Obtener el listado de mensajes por grupo
	 * @param id_group
	 */
	private loadDataMessageByGroupId(id_group) {
		var self = this;
		self.messagesChat = [];

		// 02: load data chat
		this._chatService.getMessagesGroup({ 'id_group': id_group }).subscribe(
			result => {

				if (typeof(result) === 'object') {
					result.forEach(element => {
						self.messagesChat.push({
							message: {
								'emisor': element['id_emisor'],
								'receptor': '',
								'message': element['text'],
								'id_group': element['id_group'],
								'at_created': element['at_created']
							}}
						);
					});
				}
			}
		);
	}

	/**
	 * Buscar el *id_group_user* por id_user, útil para guardar en DB
	 * @param data
	 */
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

	/**
	 * Funcion usada para enviar mensaje por grupo y por usuario
	 * @param event
	 * @param Object data message detail
	 */
	public sendMessage(event, data) {
		if (typeof(event) == 'object') {
			event.preventDefault();
		}
		
		// this.username = this.user.username;
		console.log('sendMessage: data', data);
		// this.socket.emit('new message', data);
		this._chatService.sendMessage(data).subscribe(
			result => {
				if (result > 0) {
					console.log('se registro afecto filas ' + result);

					// on socket
					this.socket.emit('new message', data);
				} else {
					alert('ocurrio un error al enviar mensaje');
				}
			}
		);

		// this.setAutoScrollGroup(data.id_group);
	}

	/**
	 * Generar el autoScroll en la caja de chat
	 * se usa en el fron ONETIME (al selecionar una sala)
	 * @param selectorID
	 */
	public setAutoScrollGroup(selectorID) {
		function getMessages() {
			// Prior to getting your messages.
			let shouldScroll = messages.scrollTop + messages.clientHeight === messages.scrollHeight;
			/*
			* Get your messages, we'll just simulate it by appending a new one syncronously.
			*/
			// After getting your messages.
			if (!shouldScroll) {
				scrollToBottom();
			}
		}

		function scrollToBottom() {
			messages.scrollTop = messages.scrollHeight;
		}

		// var messages = document.getElementById('messages');
		// If exit element (caja de chat en el dom)
		if (document.getElementById(selectorID)) {
			var messages = document.getElementById(selectorID).children[0];

			// setInterval(getMessages, 100);
			setTimeout(getMessages, 100);
		} else {
			console.log('no AUTOSCROLLING...!');
		}
	}

	/*
	***********************
	*/
	public fileChange(event, microDataMessage) {
		// var selectedFile: File;
		var self = this;
		if (event.target.files.length > 0) {
			// selectedFile = event.target.files[0];

			let uploadData = new FormData();
			uploadData.append('uploads[]', event.target.files[0], event.target.files[0].name);

			this._chatService.uploadFile(uploadData).subscribe(
				result => {

					if (result.length > 0) {
						let microData = [];
						let linkFile = '[' + result[0].name + '](' + this._variableGlobal.apiURLBase + result[0].url + ')';
						
						microDataMessage.message = linkFile;
						self.sendMessage(false, microDataMessage);
					} else {
						alert('Ocurrio un problema con el archivo');
					}
				}
			);
			// resetear valor del input file
		}
	}
}
