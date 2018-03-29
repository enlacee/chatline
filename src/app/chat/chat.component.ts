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
	// styleUrls: ['./chat.component.scss'],
	providers: [GroupuserService, ChatService],
})
export class ChatComponent implements OnInit {

	@Input() user:User;

	// element chat users peer
	public usersTabItems:any[] = []; // lista de chat de usuarios
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
		private _variableGlobal: VariableGlobalService,

	) { }

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

		// Notifica llegada de mensajes a si mismo & a otros usuarios
		this.socket.on('new message', (data) => {
			console.log("event: new message:", data);
			var stringGroup = data.message.id_group.toString();

			if (stringGroup.indexOf('peer') >= 0) {
				this.readDataSocketMessage(data);
				this.messagesChatUsers.push(data);
			} else {
				this.messagesChat.push(data);
			}

			// set autoscroll
			this.setAutoScrollGroup(data.message.id_group);
		});
	}

	private readDataSocketMessage(data) {
		console.log('readDataSocketMessage /////', data);
		var self = this;
		var dataMessage = typeof(data.message) !== 'undefined' ? data.message : false;

		// each object
		Object.keys(dataMessage).map(function(objectKey, index) {
			console.log('dataMessage', dataMessage);
			if ( objectKey === 'id_group') {
				var theUserID = self._variableGlobal.getNumberFromString(dataMessage[objectKey]);

				//
				if (data.action === 'chat') {
					theUserID = dataMessage.id_user;
				}
				console.log('theUserIDID', theUserID);

				// each all user and set temp Notification
				if ( self.groupUsers.length > 0) {
					for (let index = 0; index < self.groupUsers.length; index++) {
						let counter = typeof(self.groupUsers[index].tempMessageCounter) === 'undefined'
							? 0
							: self.groupUsers[index].tempMessageCounter;
						if (self.groupUsers[index].id_user === theUserID) {
							self.groupUsers[index].tempMessageCounter = ++counter;
						}
					}
				}
			}
			var value = dataMessage[objectKey];
			// console.log('objectKey', objectKey, 'index', index, 'value', value);
		});
	}

	/**
	 * Leer variable re-rendizar la variable contador de mensajes
	 * @param index
	 * @param item
	 */
	trackByHeroes(index: number, item: User ): number {

		return item.tempMessageCounter;
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
	hideALlTab() {
		var tabcontent;

		// Get all elements with class="tabcontent" and hide them
		tabcontent = document.getElementsByClassName("tabcontent");
		for (var i = 0; i < tabcontent.length; i++) {
			tabcontent[i].style.display = "none";
		}
	}

	openTheTab(event, id_group) {
		var tablinks;
		var self = event.currentTarget;
		this.hideALlTab();

		// Get all elements with class="tablinks" and remove the class "active"
		tablinks = document.getElementsByClassName("tablinks");
		for (var i = 0; i < tablinks.length; i++) {
			tablinks[i].className = tablinks[i].className.replace(" active", "");
		}

		// Show the current tab, and add an "active" class to the button that opened the tab
		let containerGroup = document.getElementById(id_group);
		containerGroup.style.display = "block";
		self.className += " active";

		// Ajax load (all user into group)
		this.loadDataGroupUserByGroupId(id_group);
	}

	openTabPeer(event, idSecction) {
		var self = event.currentTarget;

		this.hideALlTab();

		// 01: add and remove fontWeight bold to users
		const listItems = self.parentNode.parentNode.children;
		for (let index = 0; index < listItems.length; index++) {
			const element = listItems[index].children;
			element[0].style.fontWeight = 'normal';
		}
		self.style.fontWeight = 'bold';

		// 02: load data chat
		this.messagesChatUsers = [];

		this.addUsersTab(idSecction, self);
	}

	/**
	 * Add tabs and SHOW tab
	 */
	private addUsersTab(idTab, self){
		var tabData = this.usersTabItems;
		let dataExist = false;
		for (let index = 0; index < tabData.length; index++) {
			if (tabData[index]['id'] === idTab) {
				dataExist = true;
				break;
			}
		}

		if (dataExist === false) {
			tabData.push({ id: idTab, title: self.text.trim() });
			this.usersTabItems = tabData;

		}

		this.indexUsersTabSelected = idTab;

		// fix when dom element exist
		if (document.getElementById(idTab)) {
			document.getElementById(idTab).style.display = "block";
		}
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
		var self = event.currentTarget;

		// this.username = this.user.username;
		this.socket.emit('new message', data);
		console.log('data', data);

		this.setAutoScrollGroup(data.id_group);
	}

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
	*
	*/



}
