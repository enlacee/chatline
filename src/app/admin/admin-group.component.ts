import { Component } from '@angular/core';
import { Group } from '../models/group';
import { GroupService } from '../group.service'

@Component({
	selector: 'app-admin-group',
	templateUrl: './admin-group.component.html',
	styles: [],
	providers: [GroupService]
})
export class AdminGroupComponent {

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
	private loadData() {
		this._groupService.getData()
		.subscribe(
			result => {
				this.filteredItems = result;
				console.log('result loadData', result);
				this.init();
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

	FilterByName() {
		// this.filteredItems = [];
		let temporal = this.filteredItems;

		if (this.inputName != '') {
			temporal.forEach(element => {
				if (element.name.toUpperCase().indexOf(this.inputName.toUpperCase()) >= 0) {
					this.filteredItems = [];
					this.filteredItems.push(element);
					this.init();
				}
			});
		} else {
			// reload data and run
			this.loadData();
		}
	}
}
