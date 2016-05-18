import {Component, Pipe, PipeTransform, enableProdMode, Injectable, OnInit} from '@angular/core';
import { HTTP_PROVIDERS} from '@angular/http';
import { Api } from './api';

@Pipe({name: 'keys'})
export class KeysPipe implements PipeTransform {
  transform(value, args:string[]) : any {
    let keys = [];
    for (let key in value) {
      keys.push({key: key, value: value[key]});
    }
    return keys;
  }
}



export class Dept {
  constructor(
    public _id: number,
    public years: Array<Object>
  ) { }
}

@Component({
  selector: 'depts',
  template: `<ul>
                <li *ngFor="let dept of depts">

                	<h2>{{dept.name}}</h2>
					<ul>
						<li *ngFor="let year of dept.years | keys ">
							<details>
							<summary>{{ year.key }}</summary>	
							<ol>
								<li *ngFor="let purchase of year.value">
									<p>{{purchase.date}}</p>
									<p>{{purchase.item}}</p>
									<p>{{purchase.price}}</p>
									<p>{{purchase.quanity}}</p>
								</li>
							</ol>
							</details>	 				
						</li>
		 			</ul>
             </ul>`, 
  providers: [HTTP_PROVIDERS, Api],
  pipes: [KeysPipe]
})
export class AppDepts implements OnInit{ 
	constructor(private api: Api) {}
	errorMessage: string;
  	depts: Dept[];

	ngOnInit() {
		this.deparments();
	}
	deparments() {
		this.api.deparments()
                 .subscribe(
                   depts => this.depts = depts,
                   error =>  this.errorMessage = <any>error);
        console.log(this.depts);
	}
	generateArray(obj){
	   return Object.keys(obj).map((key)=>{ return obj[key]});
	}
}