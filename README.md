# Chatline

![chatline login](http://i64.tinypic.com/fu496h.png)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.6.8.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.


## Development
Iniciar servidor de desarrollo

	npm start

Generar archivos para produccion

	ng build --prod
	ng build --prod --base-href ./

## Agregar ´dist/.htaccess´ configuracion para apache

	RewriteEngine on
	RewriteCond %{REQUEST_FILENAME} -s [OR]
	RewriteCond %{REQUEST_FILENAME} -l [OR]
	RewriteCond %{REQUEST_FILENAME} -d
	RewriteRule ^.*$ - [NC,L]
	 
	RewriteRule ^(.*) /index.html [NC,L] 
