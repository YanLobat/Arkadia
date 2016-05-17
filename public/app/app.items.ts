import {Component, Pipe, PipeTransform, enableProdMode, Injectable, OnInit} from '@angular/core';
import { HTTP_PROVIDERS} from '@angular/http';
import { Api } from './api';

export class Item {
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
  templateUrl: "/",
  template: `<ul>
                <li *ngFor="let item of items">

                	<h2>{{item.name}}</h2>
		 			<p> {{item.price}} руб.</p>
					<p> {{item.total_quanity}} шт.</p>
					<ol>
						<li *ngFor="let purchase of item.purchases ">
		 						<p> {{purchase.date}}</p>
		 						<p> {{purchase.department}}</p>
		 						<p> {{purchase.quanity}}</p>
		 				</li>
		 			</ol>
             </ul>`, 
  providers: [HTTP_PROVIDERS, Api],
})

export class AppItems implements OnInit{ 
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