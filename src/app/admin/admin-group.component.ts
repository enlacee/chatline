import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Group } from '../models/group';
import { GroupService } from '../group.service'

@Component({
	selector: 'app-admin-group',
	templateUrl: './admin-group.component.html',
	styleUrls: ['./admin-group.component.scss'],
	providers: [GroupService]
})
export class AdminGroupComponent {
	// rest variables
	public statusCode: number;
	public requestProcessing = false;
	public articleIdToUpdate = null;
	public processValidation = false;
	public articleForm = new FormGroup({
		id_group: new FormControl(''),
		name: new FormControl('', Validators.required)
	});

	// others
	filteredItems : Group[];
	pages : number = 4; // min 4 pages
	pageSize : number = 5;
	pageNumber : number = 0;
	currentIndex : number = 1;
	items: Group[];
	pagesIndex : Array<number>;
	pageStart : number = 1;
	inputName : string = '';

	constructor(private _groupService: GroupService) {

		this._groupService.getData()
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

		/*
		this.filteredItems = [
			{"id": 1, "name": "juice 1", "description": "description 1"},
			{"id": 2, "name": "juice 2", "description": "description 2"},
			{"id": 3, "name": "juice 3", "description": "description 3"},
			{"id": 4, "name": "juice 4", "description": "description 4"},
			{"id": 5, "name": "juice 5", "description": "description 5"},
			{"id": 6, "name": "juice 6", "description": "description 6"},
			{"id": 7, "name": "juice 7", "description": "description 7"},
			{"id": 8, "name": "juice 8", "description": "description 8"},
			{"id": 9, "name": "juice 9", "description": "description 9"},
			{"id": 10, "name": "orange 1", "description": "description 1"},
			{"id": 11, "name": "orange 2", "description": "description 2"},
			{"id": 12, "name": "orange 3", "description": "description 3"},
			{"id": 13, "name": "orange 4", "description": "description 4"},
			{"id": 14, "name": "orange 5", "description": "description 5"},
			{"id": 15, "name": "orange 6", "description": "description 6"}
		];
		*/
	}

	/**
	 * Load data (comsumer API REST GET)
	 */
	private loadData(searchStatus = false) {
		this._groupService.getData()
		.subscribe( result => {
				this.filteredItems = result; console.log('result loadData', result);
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

			// each and out find element
			for (let index = 0; index < temporal.length; index++) {
				const element = temporal[index];
				if (element.name.toUpperCase().indexOf(this.inputName.toUpperCase()) >= 0) {
					this.filteredItems = [];
					this.filteredItems.push(element);
					this.init();
					return true;
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
	//Handle create and update article
	onArticleFormSubmit() {
		this.processValidation = true;
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
			this._groupService.createArticle(article)
				.subscribe(successCode => {
					this.statusCode = successCode;
					this.loadData(); // reFill data
					this.backToCreateArticle();
				},
				errorCode => this.statusCode = errorCode);
		} else {
			console.log("update group");
			//Handle update article
			article.id_group = this.articleIdToUpdate;
			this._groupService.updateArticle(article)
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
		this._groupService.getArticleById(articleId)
			.subscribe(article => {
				this.articleIdToUpdate = article.id_group;
				this.articleForm.setValue({ id_group: article.id_group, name: article.name });
				this.processValidation = true;
				this.requestProcessing = false;
			  },
			  errorCode =>  this.statusCode = errorCode);
	}
	//Delete article
	deleteArticle(articleId: string) {
		if ( window.confirm("Está seguro de querer eliminar el item[" + articleId + "] ?") ) {
			this.preProcessConfigurations();
			this._groupService.deleteArticleById(articleId)
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
}
