# Chatline

![chatline login](http://i64.tinypic.com/fu496h.png)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.6.8.

## Manual de Desarrollo
Iniciar servidor de desarrollo

	npm start

Generar archivos para produccion

	ng build --prod --base-href ./

### Agregar `dist/.htaccess` configuracion para apache

	RewriteEngine on
	RewriteCond %{REQUEST_FILENAME} -s [OR]
	RewriteCond %{REQUEST_FILENAME} -l [OR]
	RewriteCond %{REQUEST_FILENAME} -d
	RewriteRule ^.*$ - [NC,L]
	 
	RewriteRule ^(.*) /index.html [NC,L] 

### Configurar los servicios
Configurar las variables de los servicios web que se encuentran en el archivo `src/app/variable-global.service.ts`
Agregar la IP del computador servidor

	public apiURLBase:string = 'http://192.168.1.40:8080';
	public apiURL:string = 'http://192.168.1.40:8080/v1';
	public apiURLsocket: string = 'http://192.168.1.40:2020';

**apiURLBase**: La url de la dirección principal del API REST
**apiURL**: La url de la dirección del API REST version 1
**apiURLsocket**: La url del socket que utilizamos para emitir los mensajes de los usuarios