import { Component } from '@angular/core';
import { FormGroup, FormControl/*, FormBuilder*/, Validators, ValidationErrors } from '@angular/forms';
// import { EmailValidator } from '@angular/forms';
import { User } from '../models/user';
import { UserService } from '../user.service'

@Component({
	selector: 'app-admin-user',
	templateUrl: './admin-user.component.html',
	styles: [``],
	providers: [UserService]
})
export class AdminUserComponent {

	// rest variables
	public statusCode: number;
	public requestProcessing = false;
	public articleIdToUpdate = null;
	public processValidation = false;
	emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
	public articleForm = new FormGroup({
		id_user: new FormControl(''),
		firstname: new FormControl('', Validators.required),
		lastname: new FormControl(''),
		username: new FormControl('', [Validators.required, Validators.pattern(this.emailPattern)]),
		password: new FormControl('', Validators.required),
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
	pages : number = 4; // min 4 pages
	pageSize : number = 5;
	pageNumber : number = 0;
	currentIndex : number = 1;
	items: User[];
	pagesIndex : Array<number>;
	pageStart : number = 1;
	inputName : string = '';

	constructor(private _userService: UserService) {

		this._userService.getData()
		.subscribe(
			result => {
				this.filteredItems = result;
				console.log('result', result);
				this.init();
			},
			error => {
				alert("Error en la petición");
			}
		)
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
				this.articleForm.setValue({
					'id_user': article.id_user,
					'firstname': article.firstname,
					'lastname': article.lastname,
					'username': article.username,
					'password': article.password,
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
}
