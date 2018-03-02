
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';

@Injectable()
export class AuthguardGuard implements CanActivate {
	constructor(private router: Router) {}

	canActivate() {
		if (localStorage.getItem('currentUserAdmin')) {
			return true;
		}

		this.router.navigate(['/logina']);
		return false;
	}
}


