import {Component, Injectable} from '@angular/core';
import {Http, Response, Headers, HTTP_PROVIDERS, URLSearchParams} from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Item } from './app.items';
import { Dept } from './app.depts';

@Injectable()
export class Api {
	constructor(private http: Http) {}
	private items_url = 'http://localhost:3000/get';
	private depts_url = 'http://localhost:3000/departments/get';
	topItems():Observable<Item[]> {
		return this.http
			.get(this.items_url)
			.map(res => res.json())
	}
	deparments():Observable<Dept[]> {
		return this.http
			.get(this.depts_url)
			.map(res => res.json())
	}
}