import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// import { HttpClientModule } from '@angular/common/http';
import { HttpModule, JsonpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { AdminComponent } from './admin/admin.component';
// Guard Routes
import { AuthguardGuard } from  './authguard.guard'; // add into module for use into
import { VariableGlobalService } from './variable-global.service';
import { LoginFormAdminComponent } from './login-form-admin/login-form-admin.component';

// pipe
import { HowiamPipe } from './pipe/howiam.pipe';
import { AdminUserComponent } from './admin/admin-user.component';
import { AdminGroupComponent } from './admin/admin-group.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminAssociateUserComponent } from './admin/admin-associate-user.component'; // for use ngModel

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
		// pathMatch: 'full',
		children: [
			// { path: '', redirectTo: 'usuarios', pathMatch: 'full' },
			{ path: 'usuarios', component: AdminUserComponent },
			{ path: 'grupos', component: AdminGroupComponent },
			{ path: 'asociar', component: AdminAssociateUserComponent },
		  ]
	},
];

@NgModule({
	declarations: [
		AppComponent,
		LoginFormComponent,
		LoginFormAdminComponent,
		AdminComponent,
		HowiamPipe,
		AdminUserComponent,
		AdminGroupComponent,
		AdminAssociateUserComponent
	],
	imports: [
		BrowserModule,
		// import HttpClientModule after BrowserModule.
		// HttpClientModule,
		HttpModule,
		RouterModule.forRoot(appRoutes, {useHash: false/*, enableTracing: true*/}),
		FormsModule,
		ReactiveFormsModule
	],
	providers: [AuthguardGuard, VariableGlobalService],
	bootstrap: [AppComponent]
})
export class AppModule { }
