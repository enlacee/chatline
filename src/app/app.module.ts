import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
// import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { AdminComponent } from './admin/admin.component';
// Guard Routes
import { AuthguardGuard } from  './authguard.guard'; // add into module for use into
import { UserService } from './user.service';
import { LoginFormAdminComponent } from './login-form-admin/login-form-admin.component';

const appRoutes: Routes = [
	{
		path: '',
		component: LoginFormComponent,
		pathMatch: 'full'
	},
	{
		path: 'login',
		component: LoginFormComponent,
		pathMatch: 'full'
	},
	{
		path: 'logina',
		component: LoginFormAdminComponent,
		pathMatch: 'full'
	},
	{
		path: 'admin',
		canActivate: [AuthguardGuard],
		component: AdminComponent,
		pathMatch: 'full'
	},
];

@NgModule({
	declarations: [
		AppComponent,
		HeaderComponent,
		FooterComponent,
		LoginFormComponent,
		AdminComponent,
		LoginFormAdminComponent,
	],
	imports: [
		BrowserModule,
		// import HttpClientModule after BrowserModule.
		HttpClientModule,
		// HttpModule,
		RouterModule.forRoot(appRoutes, {useHash: false, enableTracing: true})
	],
	providers: [AuthguardGuard],
	bootstrap: [AppComponent]
})
export class AppModule { }
