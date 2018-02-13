// import { Injectable } from '@angular/core';
// import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
// import { Observable } from 'rxjs/Observable';
// import { UserService } from './user.service';
// import { Router } from '@angular/router';

// @Injectable()
// export class AuthguardGuard implements CanActivate {

// 	constructor(private user: UserService, private router: Router){}

// 	canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
// 		this.router.navigate(['/']);
// 		return this.user.getUserLoggedIn();
// 	}
// }


// @Injectable()
// export class AuthguardGuard implements CanActivate {

// 	canActivate() {
// 		console.log('AuthGuard#canActivate called');
// 		return true;
// 	}
// }

import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';

@Injectable()
export class AuthguardGuard implements CanActivate {
	constructor(private router: Router) {}

	canActivate() {
		if (localStorage.getItem('currentUser')) {
			return true;
		}

		this.router.navigate(['/logina']);
		return false;
    }
}


