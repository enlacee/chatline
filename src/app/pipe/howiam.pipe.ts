import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'howiam'})
export class HowiamPipe implements PipeTransform {
	transform(value: number): string {

		let rolString = '';
		if (value == 1) {
			rolString = 'SUPERADMINISTRADOR';
		} else if (value == 2) {
			rolString = 'ADMINISTRADOR';
		} else if ( value == 3 ) {
			rolString = 'USUARIO';
		}

		return rolString;
	}
}
