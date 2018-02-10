import { Component } from '@angular/core';

@Component({
	selector: 'app-footer',
	templateUrl: './footer.component.html',
	styles:[`
		footer {
			color: #6d6d6d;
			font-size: 12px;
			text-align: center;
		}
		footer p {
			margin-bottom: 0;
		}
		footer a {
			color: inherit;
		}
	`]
})
export class FooterComponent {

}
