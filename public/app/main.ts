import { bootstrap }    from '@angular/platform-browser-dynamic';

// import { AppItems } from './app.items';

// bootstrap(AppItems);
import {Component, enableProdMode, Injectable, OnInit} from '@angular/core';
import {Http, Response, Headers, HTTP_PROVIDERS, URLSearchParams} from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
class Api {
	constructor(private http: Http) {}
	private endpoint = 'http://localhost:3000/get';
	topItems():Observable<Item[]> {
		return this.http
			.get(this.endpoint)
			.map(res => res.json())
	}
	private extractData(res: Response) {
		if (res.status < 200 || res.status >= 300) {
			throw new Error('Response status: ' + res.status);
		}
		let body = res.json();
		return body.data || { };
	}
	private handleError (error: any) {
		// In a real world app, we might use a remote logging infrastructure
		let errMsg = error.message || 'Server error';
		console.error(errMsg); // log to console instead
		return Observable.throw(errMsg);
	}
}
class Item {
  constructor(
    public _id: number,
    public name: string,
    public price: number,
    public total_quanity: number,
    public purchases: Array<Object>
  ) { }
}

@Component({
  selector: 'top-items',
  template: `
  			<ul>
                <li *ngFor="let item of items"> {{item.name}} </li>
             </ul>`, 
  providers: [HTTP_PROVIDERS, Api],
})

class AppItems implements OnInit{ 
	constructor(private api: Api) {}
	errorMessage: string;
  	items: Item[];

	ngOnInit() {
		this.topItems();
	}
	topItems() {
		this.api.topItems()
                 .subscribe(
                   items => this.items = items,
                   error =>  this.errorMessage = <any>error);
        console.log(this.items);
	}
}

enableProdMode();
bootstrap(AppItems)
  .catch(err => console.error(err));