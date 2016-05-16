import {Component, enableProdMode, Injectable, OnInit} from '@angular/core';
import {Http, Headers, HTTP_PROVIDERS, URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/map';
class Api {
	constructor(private http: Http) {}
	topItems()	 {
		const endpoint = 'http://localhost:3000/';
		return this.http
			.get(endpoint,{})
			.map(res => res.json().response.docs);
	}
}
@Component({
  selector: 'top-items',
  template: `<ul>
                <li *ngFor="let item of items | async"> {{item.name}} </li>
             </ul>`, 
  providers: [HTTP_PROVIDERS, Api],
})
export class AppItems implements OnInit{ 
	constructor(private api: Api) { }
  
	ngOnInit() {
		this.items = this.api.topItems();
	}
}

enableProdMode();