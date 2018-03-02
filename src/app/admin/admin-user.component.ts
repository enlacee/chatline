import { AfterViewInit, Component, ElementRef } from '@angular/core';
import { FormGroup, FormControl/*, FormBuilder*/, Validators, ValidationErrors } from '@angular/forms';
// import { EmailValidator } from '@angular/forms';
import { User } from '../models/user';
import { UserService } from '../user.service'
import { GroupService } from '../group.service';
import { GroupuserService } from '../groupuser.service';
import { Group } from '../models/group';
import { GroupUser } from '../models/group-user';
import { Rol } from '../models/rol';

@Component({
	selector: 'app-admin-user',
	templateUrl: './admin-user.component.html',
	styleUrls: ['./admin-user.component.scss'],
	providers: [UserService, GroupService, GroupuserService]
})
export class AdminUserComponent {

	// rest variables
	public statusCode: number;
	public requestProcessing = false;
	public articleIdToUpdate = null;
	public processValidation = false;
	public currentUserPassword = '';
	emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
	public articleForm = new FormGroup({
		id_user: new FormControl(''),
		firstname: new FormControl('', Validators.required),
		lastname: new FormControl(''),
		username: new FormControl('', [Validators.required, Validators.pattern(this.emailPattern)]),
		password: new FormControl(''),
		dni: new FormControl('', [Validators.minLength(8), Validators.maxLength(8)]),
		area: new FormControl(''),
		cargo: new FormControl(''),
		status: new FormControl(''),
		chat_plus: new FormControl(''),
		at_created: new FormControl({value: '', disabled: true}),
		at_updated: new FormControl(''),
		id_rol: new FormControl(''),
	});
	public dataAreas = ['Administracion', 'Contabilidad', 'Sistemas', 'Producccion', 'Marketing', 'Diseño', 'Ventas'];
	public dataCargos = ['Abogado', 'Ingeniero de sistemas', 'Asistente de ventas', 'Recepcionista', 'Ensamblador', 'Fontanero', 'Carpintero'];

	// others
	filteredItems : User[];
	groupsItems : Group[];
	rolesItems: Rol[];
	// data tabs users
	dataOpenTheTab;


	pages : number = 4; // min 4 pages
	pageSize : number = 5;
	pageNumber : number = 0;
	currentIndex : number = 1;
	items: User[];
	pagesIndex : Array<number>;
	pageStart : number = 1;
	inputName : string = '';

	constructor(
		private _userService: UserService,
		private _groupService: GroupService,
		private _groupuserService: GroupuserService,
		private elementRef: ElementRef
	) {
		// load all users
		this._userService.getData()
			.subscribe(
				result => {
					this.filteredItems = result;
					console.log('users', result);
					this.init();
				},
				error => {
					alert("Error en la petición user");
				}
			);
		// laod all roles
		this._userService.getDataRoles()
			.subscribe(
				result => {
					this.rolesItems = result;
					console.log('roles', result);
					this.init();
				},
				error => {
					alert("Error en la petición user");
				}
			);

		// load all groups
		this._groupService.getData()
			.subscribe(
				result => {
					console.log('groups', result);
					this.groupsItems = result;
				},
				error => {
					alert("Error en la petición group");
				}
			);

		// load Grupo con usuarios
		this.triggerFalseClick();
	}

	/**
	 * Load data (comsumer API REST GET)
	 */
	private loadData(searchStatus = false) {
		this._userService.getData()
		.subscribe( result => {
				this.filteredItems = result;
				if (searchStatus == true) {
					this.FilterByName();
				} else {
					this.init();
				}
			},
			error => {
				alert("Error en la petición");
			}
		)
	}

	init() {
		this.currentIndex = 1;
		this.pageStart = 1;
		this.pages = 4;

		this.pageNumber = parseInt("" + (this.filteredItems.length/this.pageSize));
		if (this.filteredItems.length % this.pageSize != 0) {
			this.pageNumber++; // fix items exedents
		}

		if (this.pageNumber < this.pages) {
			this.pages = this.pageNumber;
		}

		this.refreshItems();
		console.log('this.pageNumber', this.pageNumber);
	}

	// get portion items to show
	refreshItems() {
		this.items = this.filteredItems.slice((this.currentIndex-1)*this.pageSize, (this.currentIndex)*this.pageSize);
		this.pagesIndex = this.fillArray();
		console.log('this.pagesIndex', this.pagesIndex);
	}

	fillArray():any {
		var obj = new Array();
		for (var index = this.pageStart; index < (this.pageStart+this.pages); index++) {
			obj.push(index);
		}

		return obj;
	}

	// search by name
	FilterByName() {
		let temporal = this.filteredItems;

		if (this.inputName != '') {
			if (temporal.length == 0 || temporal.length == 1){
				this.loadData(true); // reuse function *FilterByName*
				return true;
			}

			this.filteredItems = [];
			// each and out find element
			for (let index = 0; index < temporal.length; index++) {
				const element = temporal[index];
				let inputSplit = this.inputName.split(' ');

				if (inputSplit.length > 1) {
					// Search by two string (firstname lastname)
				} else {
					element.firstname = typeof(element.firstname) === 'string' ? element.firstname : '';
					element.lastname = typeof(element.lastname) === 'string' ? element.lastname : '';
					if (
						element.firstname.toUpperCase().indexOf(this.inputName.toUpperCase()) >= 0 ||
						element.lastname.toUpperCase().indexOf(this.inputName.toUpperCase()) >= 0
					) {
						this.filteredItems.push(element);
					}
				}

				// End items (print table all content)
				if ((temporal.length-1) === index) {
					this.init();
				}
			}
		} else {
			this.loadData(); // reload data and run
		}
	}

	// pagination
	prevPage(){
		if(this.currentIndex > 1){
			this.currentIndex --;
		}
		if(this.currentIndex < this.pageStart){
			this.pageStart = this.currentIndex;
		}
		this.refreshItems();
	}
	nextPage(){
		if(this.currentIndex < this.pageNumber){
			this.currentIndex ++;
		}
		if(this.currentIndex >= (this.pageStart + this.pages)){
			this.pageStart = this.currentIndex - this.pages + 1;
		}

		this.refreshItems();
	}
	setPage(index : number){
		this.currentIndex = index;
		this.refreshItems();
	}
	// function CRUD
	onArticleFormSubmit() {
		this.processValidation = true;

		this.getFormValidationErrors();
		if (this.articleForm.invalid) {
			console.log("return");
			return; //Validation failed, exit from method.
		}
		//Form is valid, now perform create or update
		this.preProcessConfigurations();
		let article = this.articleForm.value;
		console.log('article', article);
		if (this.articleIdToUpdate === null) {
			//Create article
			this._userService.createArticle(article)
				.subscribe(successCode => {
					this.statusCode = successCode;
					this.loadData(); // reFill data
					this.backToCreateArticle();
				},
				errorCode => this.statusCode = errorCode);
		} else {
			//Handle update article
			article.id_group = this.articleIdToUpdate;
			this._userService.updateArticle(article)
				.subscribe(successCode => {
						this.statusCode = successCode;
						this.loadData(); // reFill data
						this.backToCreateArticle();
					},
					errorCode => this.statusCode = errorCode);
		}
	}
	//Load article by id to edit
	loadArticleToEdit(articleId: string) {
		this.preProcessConfigurations();
		this._userService.getArticleById(articleId)
			.subscribe(article => {
				this.articleIdToUpdate = article.id_user;

				console.log('article user', article);
				this.currentUserPassword = article.password;
				this.articleForm.setValue({
					'id_user': article.id_user,
					'firstname': article.firstname,
					'lastname': article.lastname,
					'username': article.username,
					'password': '',// article.password,
					'dni': article.dni,
					'area': article.area,
					'cargo': article.cargo,
					'status': article.status,
					'chat_plus': article.chat_plus,
					'at_created': article.at_created,
					'at_updated': article.at_updated,
					'id_rol': article.id_rol
				});
				this.processValidation = true;
				this.requestProcessing = false;
			},
			errorCode =>  this.statusCode = errorCode);
	}
	//Delete article
	deleteArticle(articleId: string) {
		if ( window.confirm("Está seguro de querer eliminar el item[" + articleId + "] ?") ) {
			this.preProcessConfigurations();
			this._userService.deleteArticleById(articleId)
				.subscribe(successCode => {
						//this.statusCode = successCode;
						//Expecting success code 204 from server
						this.statusCode = 204;
						this.loadData(); // reFill data
						this.backToCreateArticle();
					},
					errorCode => this.statusCode = errorCode);
		}
	}
	preProcessConfigurations() {
		this.statusCode = null;
		this.requestProcessing = true;
	}
	//Go back from update to create
	backToCreateArticle() {
		this.articleIdToUpdate = null;
		this.articleForm.reset();
		this.processValidation = false;

		this.currentUserPassword = '';
	}
	getFormValidationErrors() {
		Object.keys(this.articleForm.controls).forEach(key => {

		const controlErrors: ValidationErrors = this.articleForm.get(key).errors;
		if (controlErrors != null) {
			  Object.keys(controlErrors).forEach(keyError => {
				console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
			  });
			}
		  });
	}
	// asociar grupos y usuarios
	onDragStart(event, data) {
		console.log('data id', data);
		event.dataTransfer.setData('data', data);
	}
	onDrop(event, data) {
		let idUser = event.dataTransfer.getData('data');
		let idGroup = event.currentTarget.getAttribute('data-group-id');

		event.preventDefault();
		console.log('id', idUser);
		console.log('event.currentTarget', event.currentTarget.getAttribute('data-group-id'));

		// REST (post create new)
		let article = new GroupUser();
		article.id_group = idGroup;
		article.id_user = idUser;

		// 01: validation
		for (let index = 0; index < this.dataOpenTheTab.length; index++) {
			if (this.dataOpenTheTab[index].id_user == idUser) {
				alert('Seleccione otro usuario. El Usuario (Id: ' + idUser + ') ya existe');
				return false;
			}
		}

		// 02: insert
		this._groupuserService.createArticle(article)
			.subscribe(successCode => {
				this.statusCode = successCode;
				// this.loadData(); // reFill data
				// this.backToCreateArticle();

				this.loadDataGroupUserByGroupId(idGroup);
			},
			errorCode => this.statusCode = errorCode);
	}
	allowDrop(event) {
		event.preventDefault();
	}
	//Delete article
	deleteGroupUser(event, articleId: string, id_group: string) {

		if ( window.confirm("Está seguro de querer eliminar el item[" + articleId + "] ?") ) {
			// var elem = event.currentTarget.parentElement;
			// elem.parentNode.removeChild(elem);

			// this.preProcessConfigurations();
			this._groupuserService.deleteArticleById(articleId)
				.subscribe(successCode => {
						this.statusCode = successCode;
						//Expecting success code 204 from server
						this.statusCode = 204;
						// this.loadData(); // reFill data
						// this.backToCreateArticle();

						this.loadDataGroupUserByGroupId(id_group);
					},
					errorCode => this.statusCode = errorCode);
		}
	}
	/**
	 ************************************************************
	 * tab style (all functions)
	 ************************************************************
	 */
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

	triggerFalseClick() {
		let tablinks = document.getElementsByClassName('tablinks');
		if (tablinks.length > 0) {
			tablinks[0].click();
		}

	}
	// load INIT
	ngOnInit() {
		// your other code
		setTimeout(() => {
			this.triggerFalseClick();
		}, 200);
	}

}
