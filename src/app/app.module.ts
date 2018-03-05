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
import { AuthguardfrontGuard } from  './authguardfront.guard'; // add into module for use into

import { VariableGlobalService } from './variable-global.service';
import { LoginFormAdminComponent } from './login-form-admin/login-form-admin.component';

// pipe
import { HowiamPipe } from './pipe/howiam.pipe';
import { TruncatePipe } from './pipe/truncate.pipe';
import { AdminUserComponent } from './admin/admin-user.component';
import { AdminGroupComponent } from './admin/admin-group.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChatComponent } from './chat/chat.component';

const appRoutes: Routes = [
	{
		path: '',
		canActivate: [AuthguardfrontGuard],
		component: ChatComponent,
		pathMatch: 'full',

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
		TruncatePipe,
		AdminUserComponent,
		AdminGroupComponent,
		ChatComponent,
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
	providers: [AuthguardfrontGuard, AuthguardGuard, VariableGlobalService],
	bootstrap: [AppComponent]
})
export class AppModule { }
