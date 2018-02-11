import { RouterModule, Routes } from '@angular/router';

import { LoginFormComponent } from './login-form/login-form.component';
import { AdminComponent } from './admin/admin.component';
import { ModuleWithProviders } from '@angular/core';

const appRoutes: Routes = [
	{ path: 'admin',	component: AdminComponent },
	{
		path: 'login',
		component: LoginFormComponent,
		data: { title: 'Iniciar Sesión'}
	},
	{
		path: '',
		redirectTo: '/login',
		pathMatch: 'full'
	},
];

export const routes:ModuleWithProviders = RouterModule.forRoot(appRoutes, {useHash: false, enableTracing: true});
