import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { routes } from './app.routes';


import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { AdminComponent } from './admin/admin.component';


@NgModule({
	declarations: [
		AppComponent,
		HeaderComponent,
		FooterComponent,
		LoginFormComponent,
		AdminComponent,
	],
	imports: [
		BrowserModule,
		// import HttpClientModule after BrowserModule.
		HttpClientModule,
		routes
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
