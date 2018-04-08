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
		this.user = JSON.parse(localStorage.getItem('currentUser'));

		// load all user (like diccionary)
		this._userService.getDataDiccionary().subscribe(result => {
			this.userDiccinary = result

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

		// Notifica llegada de mensajes a si mismo & a otros usuarios
		this.socket.on('new message', (data) => {
			var theData = data.message;
			console.log("event: new message:", data);

			if (theData.chatType === 'group') {
				this.messagesChat.push(data);
			} else if(theData.chatType === 'user') {
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
	 * @param event
	 * @param idElement
	 */
	openTheTab(event, idElement) {
		var tablinks;
		var self = event.currentTarget;
		this.hideALlTab();

		// Get all elements with class="tablinks" and remove the class "active"
		tablinks = document.getElementsByClassName("tablinks");
		for (var i = 0; i < tablinks.length; i++) {
			tablinks[i].className = tablinks[i].className.replace(" active", "");
		}

		// Show the current tab, and add an "active" class to the button that opened the tab
		let containerGroup = document.getElementById(idElement);
		containerGroup.style.display = "block";
		self.className += " active";

		// Ajax load (all user into group)
		this.loadDataGroupUserByGroupId(idElement);
		this.loadDataMessageByGroupId(idElement);
	}

	/**
	 * Mostrar la caja de chat del Usuario
	 * @param event
	 * @param data
	 */
	openTabPeer(event, data) {
		// console.log('click : openTabPeer() ', data.emisor, data.receptor);
		var self = event.currentTarget;
		var showUserChat = function() {
			if (document.getElementById('user-chat')) {
				document.getElementById('user-chat').style.display = "block";
			}
		}
		console.log('data', data);
		this.hideALlTab();
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

		// this.messagesChatUsers = [];
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
	 *
	 * @param event
	 * @param Object data message detail
	 */
	public sendMessage(event, data) {
		event.preventDefault();
		var self = event.currentTarget;

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
	 * @param selectorID
	 */
	private setAutoScrollGroup(selectorID) {
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
	public fileChange(event) {
		let fileList: FileList = event.target.files;
		console.log('fileList', fileList.length);
		if (fileList.length > 0) {
			let file: File = fileList[0];
			console.log('file', file);
			let formData:FormData = new FormData();
			formData.append('uploads', file, file.name);
			console.log('formData ANTES', formData.get('uploads'));
			this._chatService.uploadFile(formData).subscribe(
				result => {
					console.log('result IMAGEN', result);
				}
			);

		}
	}

}
